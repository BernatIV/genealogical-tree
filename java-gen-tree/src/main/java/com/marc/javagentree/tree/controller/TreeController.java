package com.marc.javagentree.tree.controller;

import com.marc.javagentree.tree.business.TreeService;
import com.marc.javagentree.tree.model.NodeModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/tree")
public class TreeController {

    private final TreeService treeService;

    @Autowired
    public TreeController(TreeService treeService) {
        this.treeService = treeService;
    }

    @GetMapping
    public List<NodeModel> getNodes() {
        return treeService.getNodes();
    }

    @PostMapping("addNode")
    public NodeModel addNewNode(@RequestBody NodeModel node) {
        System.out.println("Hola primo");
        return treeService.addNewNode(node);
    }

    @PostMapping
    public void updateNodePositionsAndEdges() {

    }
}
