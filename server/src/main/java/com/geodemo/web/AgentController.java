package com.geodemo.web;

import com.geodemo.service.AgentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/chat")
    public AgentService.Answer chat(@RequestBody ChatRequest request) {
        return agentService.chat(request.brandId(), request.message());
    }

    public record ChatRequest(Long brandId, String message) {
    }
}
