package com.marc.javagentree.tree.business;

import com.marc.javagentree.tree.model.NodeModel;
import com.marc.javagentree.tree.repository.EdgeRepository;
import com.marc.javagentree.tree.repository.NodeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreeService {

    private NodeRepository nodeRepository;
    private EdgeRepository edgeRepository;

    public TreeService(NodeRepository nodeRepository, EdgeRepository edgeRepository) {
        this.nodeRepository = nodeRepository;
        this.edgeRepository = edgeRepository;
    }

    public List<NodeModel> getNodes() {
        return nodeRepository.findAll();
    }

    public NodeModel addNewNode(NodeModel node) {
        return nodeRepository.save(node);
    }
}
