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
public class ProposingBuyEquipmentResource {


    @GetMapping("/proposing-buy-equipments")
    public String Form(Model model) {
        model.addAttribute("proposing-buy-equipments", new ProposingBuyEquipmentResource());
        return "proposing-buy-equipments";
    }

    @PostMapping("/proposing-buy-equipments")
    public String Send(@ModelAttribute ProposingBuyEquipmentResource proposingBuyEquipmentResource, Model model) {
        model.addAttribute("proposing-buy-equipments", proposingBuyEquipmentResource);
        return "send";
    }
}