package com.boot.main.controller.error;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class ErrorController {
    @RequestMapping("/403")
    public String error_403(){
        return "error/403";
    }
    @RequestMapping("/404")
    public String error_404(){
        return "error/404";
    }
    @RequestMapping("/500")
    public String error_500(){
        return "error/500";
    }
    @RequestMapping("/504")
    public String error_504(){
        return "error/504";
    }
}
