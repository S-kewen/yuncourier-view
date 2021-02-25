package com.boot.main.controller.service.sms;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class SmsController {
    @RequestMapping("/service/sms/listMySms")
    public String service_sms_listMySms(){
        return "service/sms/listMySms";
    }
    @RequestMapping("/service/sms/seeSms")
    public String service_sms_seeSms(){
        return "service/sms/seeSms";
    }
}
