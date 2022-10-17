package com.marc.javagentree.tree.business;

import com.marc.javagentree.tree.model.EdgeModel;
import com.marc.javagentree.tree.model.NodeModel;
import com.marc.javagentree.tree.repository.EdgeRepository;
import com.marc.javagentree.tree.repository.NodeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreeService {

    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

    public TreeService(NodeRepository nodeRepository, EdgeRepository edgeRepository) {
        this.nodeRepository = nodeRepository;
        this.edgeRepository = edgeRepository;
    }

    public List<NodeModel> getNodes() {
        return nodeRepository.findAll();
    }

    public List<EdgeModel> getEdges() {
        return edgeRepository.findAll();
    }

    public NodeModel addNewNode(NodeModel node) {
        return nodeRepository.save(node);
    }

    public void updateNodes(List<NodeModel> nodes) {
        nodeRepository.saveAll(nodes);
        // TODO: borrar els nodes que estiguin a la db pero no a l'objecte del param
    }

    public void saveEdges(List<EdgeModel> edges) {
        edgeRepository.saveAll(edges);
        // TODO: borrar els edges que estiguin a la db pero no a l'objecte del param
    }
}
