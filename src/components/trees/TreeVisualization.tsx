
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  NodeTypes,
  MarkerType,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { FamilyMember } from '@/types/FamilyMember';
import PersonNode from './PersonNode';
import { Plus } from 'lucide-react';

// Define our custom node types
const nodeTypes: NodeTypes = {
  person: PersonNode,
};

interface TreeVisualizationProps {
  members: FamilyMember[];
  onAddMember: () => void;
  onSelectMember: (member: FamilyMember) => void;
}

// Helper function to create node data from family members
const createNodesAndEdges = (members: FamilyMember[]) => {
  const nodes = members.map((member, index) => ({
    id: member.id,
    type: 'person',
    position: { 
      x: 100 + (index % 3) * 200, 
      y: 100 + Math.floor(index / 3) * 200 
    },
    data: { ...member },
  }));

  // This is a simple way to create edges - in a real app, you'd use the actual relationships
  const edges: Edge[] = [];
  
  // Create parent-child relationships
  const childRelations = ['Son', 'Daughter'];
  const parentRelations = ['Father', 'Mother'];
  
  members.forEach(member => {
    if (childRelations.includes(member.relation)) {
      // Find potential parents
      const parents = members.filter(m => parentRelations.includes(m.relation));
      
      if (parents.length > 0) {
        // Connect to the first parent found (simplified approach)
        edges.push({
          id: `e-${parents[0].id}-${member.id}`,
          source: parents[0].id,
          target: member.id,
          type: 'smoothstep',
          animated: false,
        });
      }
    }
  });

  // Add spouse relationships
  const spouses = members.filter(m => m.relation === 'Spouse');
  if (spouses.length >= 2) {
    for (let i = 0; i < spouses.length - 1; i += 2) {
      edges.push({
        id: `e-${spouses[i].id}-${spouses[i+1].id}`,
        source: spouses[i].id,
        target: spouses[i+1].id,
        type: 'straight',
        style: { strokeDasharray: '5,5' },
      });
    }
  }

  return { nodes, edges };
};

const TreeVisualization = ({ members, onAddMember, onSelectMember }: TreeVisualizationProps) => {
  const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(members);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update the visualization when members change
  useState(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(members);
    setNodes(newNodes);
    setEdges(newEdges);
  });

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    const member = members.find(m => m.id === node.id);
    if (member) {
      onSelectMember(member);
    }
  };

  return (
    <div style={{ width: '100%', height: '600px' }} className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          style: { stroke: '#B8E0F6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#B8E0F6',
          },
        }}
      >
        <Background gap={16} size={1} color="#f8f8f8" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            if (node.data) {
              const nodeData = node.data as FamilyMember;
              switch (nodeData.relation) {
                case 'Father':
                case 'Mother':
                  return '#A8D5BA';
                case 'Son':
                case 'Daughter':
                  return '#FFD6C4';
                case 'Spouse':
                  return '#FFDEE2';
                default:
                  return '#E5DEFF';
              }
            }
            return '#E5DEFF';
          }}
        />
        <Panel position="top-right" className="bg-white rounded-lg shadow-sm border p-2">
          <Button variant="outline" size="sm" onClick={onAddMember} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default TreeVisualization;
