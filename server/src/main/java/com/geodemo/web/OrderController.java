package com.geodemo.web;

import com.geodemo.domain.Channel;
import com.geodemo.domain.PublishOrder;
import com.geodemo.repo.ChannelRepository;
import com.geodemo.repo.OrderRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orders;
    private final ChannelRepository channels;

    public OrderController(OrderRepository orders, ChannelRepository channels) {
        this.orders = orders;
        this.channels = channels;
    }

    @GetMapping
    public Map<String, Object> list() {
        List<PublishOrder> list = orders.findAllByOrderByIdDesc();
        int totalCost = list.stream().mapToInt(o -> o.cost).sum();
        long published = list.stream().filter(o -> "已发布".equals(o.status)).count();
        return Map.of(
                "orders", list,
                "count", list.size(),
                "totalCost", totalCost,
                "published", published
        );
    }

    /** 一键分发：按渠道逐单创建工单并落库，费用按渠道单价累加。 */
    @PostMapping
    public Map<String, Object> create(@RequestBody CreateOrdersRequest request) {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        List<PublishOrder> created = new ArrayList<>();
        int seq = (int) orders.count() + 1;

        for (Long channelId : request.channelIds()) {
            Channel channel = channels.findById(channelId).orElse(null);
            if (channel == null) {
                continue;
            }
            String code = String.format("PW-%s-%03d", date, seq++);
            created.add(new PublishOrder(code, request.articleTitle(), channel.name, "待发布", channel.price));
        }
        orders.saveAll(created);

        int total = created.stream().mapToInt(o -> o.cost).sum();
        return Map.of("created", created.size(), "totalCost", total, "orders", created);
    }

    public record CreateOrdersRequest(String articleTitle, List<Long> channelIds) {
    }
}
