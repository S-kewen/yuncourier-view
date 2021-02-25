package com.boot.main.controller.service.mail;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller

public class MailController {
    @RequestMapping("/service/mail/listMyMail")
    public String service_mail_listMyMail(){
        return "service/mail/listMyMail";
    }
    @RequestMapping("/service/mail/seeMail")
    public String service_mail_seeMail(){
        return "service/mail/seeMail";
    }
    @RequestMapping("/service/mail/listMySmtp")
    public String service_mail_listMySmtp(){
        return "service/mail/listMySmtp";
    }
    @RequestMapping("/service/mail/editSmtp")
    public String service_mail_editSmtp(){
        return "service/mail/editSmtp";
    }
    @RequestMapping("/service/mail/addSmtp")
    public String service_mail_addSmtp(){
        return "service/mail/addSmtp";
    }
}
