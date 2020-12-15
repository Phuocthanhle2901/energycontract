package vn.infodation.intern.group1.mas.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * UploadCSVResource controller
 */
@RestController
@RequestMapping("/api/upload-csv")
public class UploadCSVResource {

    private final Logger log = LoggerFactory.getLogger(UploadCSVResource.class);

    /**
    * POST upload
    */
    @PostMapping("/upload")
    public String upload() {
        return "upload";
    }

    /**
    * GET getFile
    */
    @GetMapping("/get-file")
    public String getFile() {
        return "getFile";
    }

}
