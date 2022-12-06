package com.marc.javagentree.tree.business;

import com.marc.javagentree.tree.model.EdgeModel;
import com.marc.javagentree.tree.model.NodeModel;
import com.marc.javagentree.tree.repository.EdgeRepository;
import com.marc.javagentree.tree.repository.NodeRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public NodeModel createOrUpdateNode(NodeModel node) {
        return nodeRepository.save(node);
    }

    public List<NodeModel> updateNodes(List<NodeModel> nodes) {
        return nodeRepository.saveAll(nodes);
    }

    @Transactional
    public List<EdgeModel> saveEdges(List<EdgeModel> edges) {

        // Search for nodes with temporaryId
        List<NodeModel> nodesWithTemporaryId = new ArrayList<>(nodeRepository.findAllNodesWithTemporaryId());
        Map<String, Long> nodesIds = new HashMap<>();

        nodesWithTemporaryId.forEach(node -> nodesIds.put(node.getTemporaryId(), node.getId()));

        // Replace node temporaryId in Edge table with the one created for the DB
        edges.stream()
                .filter(edge -> {
                    String[] parts = edge.getSource().split("_");
                    return parts.length == 2 && parts[1].equals("new");
                })
                .forEach(edge -> edge.setSource(nodesIds.get(edge.getSource()).toString()));

        edges.stream()
                .filter(edge -> {
                    String[] parts = edge.getTarget().split("_");
                    return parts.length == 2 && parts[1].equals("new");
                })
                .forEach(edge -> edge.setTarget(nodesIds.get(edge.getTarget()).toString()));

        // clean temporaryIds
        nodesWithTemporaryId.forEach(node -> node.setTemporaryId(null));

        return edgeRepository.saveAll(edges);
    }

    public void deleteNode(Long nodeId) {
        nodeRepository.deleteById(nodeId);
    }

    public void deleteEdges(List<EdgeModel> edges) {
        edgeRepository.deleteAll(edges);
    }
}
