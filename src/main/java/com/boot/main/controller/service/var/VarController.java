package com.boot.main.controller.service.var;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class VarController {
    @RequestMapping("/service/var/listVar")
    public String listVar(){
        return "service/var/listVar";
    }
    @RequestMapping("/service/var/addVar")
    public String addVar(){
        return "service/var/addVar";
    }
    @RequestMapping("/service/var/editVar")
    public String editVar(){
        return "service/var/editVar";
    }
    @RequestMapping("/service/var/listVarRecord")
    public String listVarRecord(){
        return "service/var/listVarRecord";
    }
}
