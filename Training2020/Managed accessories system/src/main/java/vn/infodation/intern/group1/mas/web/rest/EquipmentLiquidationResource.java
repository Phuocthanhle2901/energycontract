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
public class EquipmentLiquidationResource {


    @GetMapping("/equipment-liquidations")
    public String Form(Model model) {
        model.addAttribute("equipment-liquidation", new EquipmentLiquidationResource());
        return "equipment-liquidation";
    }

    @PostMapping("/equipment-liquidations")
    public String Send(@ModelAttribute EquipmentLiquidationResource equipmentLiquidationResource, Model model) {
        model.addAttribute("equipment-liquidation", equipmentLiquidationResource);
        return "send";
    }
}