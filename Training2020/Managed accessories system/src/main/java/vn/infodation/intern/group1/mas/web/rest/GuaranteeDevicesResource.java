package vn.infodation.intern.group1.mas.web.rest;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api")
@Transactional
public class GuaranteeDevicesResource {


    @GetMapping("/guarantee-devicess")
    public String Form(Model model) {
        model.addAttribute("guarantee-devicess", new GuaranteeDevicesResource());
        return "guarantee-devicess";
    }

    @PostMapping("/guarantee-devicess")
    public String Send(@ModelAttribute GuaranteeDevicesResource guaranteeDevicesResource, Model model) {
        model.addAttribute("guarantee-devicess", guaranteeDevicesResource);
        return "send";
    }
}
