package com.marc.javagentree.tree.controller;

import com.marc.javagentree.tree.business.TreeService;
import com.marc.javagentree.tree.model.EdgeModel;
import com.marc.javagentree.tree.model.NodeModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = "https://arbregenealogic.com",
        allowCredentials = "true")
@RestController
@RequestMapping("api/tree")
public class TreeController {

    private final TreeService treeService;

    @Autowired
    public TreeController(TreeService treeService) {
        this.treeService = treeService;
    }

    @GetMapping("nodes")
    public List<NodeModel> getNodes() {
        return treeService.getNodes();
    }

    @GetMapping("edges")
    public List<EdgeModel> getEdges() {
        return treeService.getEdges();
    }

    @PostMapping("addNode")
    public NodeModel addNewNode(@RequestBody NodeModel node) {
        return treeService.addNewNode(node);
    }

    @PostMapping("updateNodes")
    public List<NodeModel> updateNodes(@RequestBody List<NodeModel> nodes) {
        return treeService.updateNodes(nodes);
    }

    @PostMapping("saveEdges")
    public List<EdgeModel> saveEdges(@RequestBody List<EdgeModel> edges) {
        return treeService.saveEdges(edges);
    }

    @DeleteMapping("node/{nodeId}")
    public void deleteNode(@PathVariable Long nodeId) {
        treeService.deleteNode(nodeId);
    }

    @PostMapping("deleteEdges")
    public void deleteEdge(@RequestBody List<EdgeModel> edges) {
        treeService.deleteEdges(edges);
    }
}
