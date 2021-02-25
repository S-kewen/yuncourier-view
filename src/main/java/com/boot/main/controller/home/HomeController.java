package com.boot.main.controller.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class HomeController {
    @RequestMapping("/home/console")
    public String console(){
        return "home/console";
    }
}
