package com.boot.main.controller.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class AppController {
    @RequestMapping("/app/listMySoftware")
    public String listMySoftware(){
        return "app/listMySoftware";
    }
    @RequestMapping("/app/addSoftware")
    public String addSoftware(){
        return "app/addSoftware";
    }
    @RequestMapping("/app/editSoftware")
    public String editSoftware(){
        return "app/editSoftware";
    }
    @RequestMapping("app/seeSoftware")
    public String seeSoftware(){
        return "app/seeSoftware";
    }
}
