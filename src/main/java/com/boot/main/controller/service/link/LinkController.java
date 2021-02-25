package com.boot.main.controller.service.link;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class LinkController {
    @RequestMapping("/service/link/listMyLink")
    public String service_link_listMyLink(){
        return "service/link/listMyLink";
    }
    @RequestMapping("/service/link/addShort")
    public String service_link_addShort(){
        return "service/link/addShort";
    }

    @RequestMapping("/service/link/listMyLinkRecord")
    public String service_link_listMyLinkRecord(){
        return "service/link/listMyLinkRecord";
    }
}
