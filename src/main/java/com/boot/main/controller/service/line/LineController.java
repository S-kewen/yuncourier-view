package com.boot.main.controller.service.line;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class LineController {
    @RequestMapping("/service/line/listLineConfig")
    public String listLineConfig(){
        return "service/line/listLineConfig";
    }
    @RequestMapping("/service/line/addLineConfig")
    public String addLineConfig(){
        return "service/line/addLineConfig";
    }
    @RequestMapping("/service/line/editLineConfig")
    public String editLineConfig(){
        return "service/line/editLineConfig";
    }
    @RequestMapping("/service/line/listPushMessage")
    public String listPushMessage(){
        return "service/line/listPushMessage";
    }
    @RequestMapping("/service/line/seePushMessage")
    public String seePushMessage(){
        return "service/line/seePushMessage";
    }
}
