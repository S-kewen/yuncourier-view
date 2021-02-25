package com.boot.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class MainController {
    @RequestMapping("/")
    public String main(){
        return "login";
    }
    @RequestMapping("/login")
    public String login(){
        return "login";
    }
    @RequestMapping("/index")
    public String index(HttpServletRequest request, HttpServletResponse response){
        Cookie[] cookies = request.getCookies();
        if(cookies != null && cookies.length > 0){
            for (Cookie cookie : cookies){
                if(cookie.getName().equals("token")){
                    return "index";
                }
            }
        }
        return "redirect:login";
    }
    @RequestMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response){
        Cookie[] cookies = request.getCookies();
        if(cookies!=null){
            for (Cookie cookie : cookies) {
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }
        return "redirect:login";
    }
}
