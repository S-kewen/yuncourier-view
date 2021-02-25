package com.boot.main.controller.service.log;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class LogController {
    @RequestMapping("/service/log/listLog")
    public String listLog(){
        return "service/log/listLog";
    }
}
