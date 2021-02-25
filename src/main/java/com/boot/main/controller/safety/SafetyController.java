package com.boot.main.controller.safety;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class SafetyController {
    @RequestMapping("/safety/listFirewall")
    public String safety_listFirewall(){
        return "safety/listFirewall";
    }
    @RequestMapping("/safety/addFirewall")
    public String safety_addFirewall(){
        return "safety/addFirewall";
    }
    @RequestMapping("/safety/editFirewall")
    public String safety_editFirewall(){
        return "safety/editFirewall";
    }
    @RequestMapping("/safety/listInterceptRecord")
    public String safety_listInterceptRecord(){
        return "safety/listInterceptRecord";
    }

}
