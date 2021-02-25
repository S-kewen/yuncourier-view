package com.boot.main.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class UserController {
    @RequestMapping("/user/index")
    public String index(){
        return "user/index";
    }
    @RequestMapping("/user/listTransaction")
    public String listTransaction(){
        return "user/listTransaction";
    }
    @RequestMapping("/user/listLoginRecord")
    public String listLoginRecord(){
        return "user/listLoginRecord";
    }
    @RequestMapping("/user/listMessage")
    public String listMessage(){
        return "user/listMessage";
    }
    @RequestMapping("/user/modifyInfo")
    public String modifyInfo(){
        return "user/modifyInfo";
    }
    @RequestMapping("/user/modifyPassword")
    public String modifyPassword(){
        return "user/modifyPassword";
    }
}
