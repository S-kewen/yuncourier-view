package com.boot.main.controller.service.file;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class FileController {
    @RequestMapping("/service/file/listMyCos")
    public String service_file_listMyCos(){
        return "service/file/listMyCos";
    }
    @RequestMapping("/service/file/editCos")
    public String service_file_editCos(){
        return "service/file/editCos";
    }
    @RequestMapping("/service/file/addCos")
    public String service_file_addCos(){
        return "service/file/addCos";
    }
    @RequestMapping("/service/file/selectCos")
    public String service_file_selectCos(){
        return "service/file/selectCos";
    }
    @RequestMapping("/service/file/listMyFile")
    public String service_file_listMyFile(){
        return "service/file/listMyFile";
    }
    @RequestMapping("/service/file/editFile")
    public String service_file_editFile(){
        return "service/file/editFile";
    }
    @RequestMapping("/service/file/queueUpload")
    public String service_file_queueUpload(){
        return "service/file/queueUpload";
    }
    @RequestMapping("/downloadCosFile")
    public String service_file_downloadCosFile(){
        return "service/file/downloadCosFile";
    }

}
