package com.boot.main.controller.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class ApiController {
    @RequestMapping("/api/index")
    public String api_index(){
        return "api/index";
    }
}
