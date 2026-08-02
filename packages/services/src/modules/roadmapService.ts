import { SkillRoadmap, RoadmapNode, CourseLevel } from '@career-bridge/types';

export const generatePersonalizedRoadmap = (role: string): SkillRoadmap => {
  const baseRoadmap: Partial<SkillRoadmap> = {
    id: `rdm-${Date.now()}`,
    title: `${role} Mastery Path`,
    description: `A personalized, AI-generated curriculum to take you from beginner to job-ready as a ${role}.`,
    targetRole: role,
    estimatedDuration: 90, // Days
    nodes: []
  };

  const commonNodes: RoadmapNode[] = [
    {
      id: 'node-1',
      skill: 'Fundamentals & Setup',
      level: CourseLevel.BEGINNER,
      status: 'available',
      courses: ['Environment Setup', 'Core Concepts'],
      projects: [],
      dependsOn: [],
      position: { x: 0, y: 0 }
    },
    {
      id: 'node-2',
      skill: 'Core Principles',
      level: CourseLevel.BEGINNER,
      status: 'locked',
      courses: ['Architecture Patterns', 'Design Thinking'],
      projects: ['Basic Prototype'],
      dependsOn: ['node-1'],
      position: { x: 0, y: 0 }
    }
  ];

  let specializedNodes: RoadmapNode[] = [];

  if (role.includes('Developer')) {
    specializedNodes = [
      {
        id: 'node-dev-1',
        skill: 'Frontend Excellence',
        level: CourseLevel.INTERMEDIATE,
        status: 'locked',
        courses: ['React Mastery', 'Performance Optimization'],
        projects: ['Personal Portfolio'],
        dependsOn: ['node-2'],
        position: { x: 0, y: 0 }
      },
      {
        id: 'node-dev-2',
        skill: 'Backend Scalability',
        level: CourseLevel.ADVANCED,
        status: 'locked',
        courses: ['Node.js Architecture', 'Microservices'],
        projects: ['E-commerce Backend'],
        dependsOn: ['node-dev-1'],
        position: { x: 0, y: 0 }
      }
    ];
  } else if (role.includes('Designer')) {
    specializedNodes = [
      {
        id: 'node-des-1',
        skill: 'UI Design Systems',
        level: CourseLevel.INTERMEDIATE,
        status: 'locked',
        courses: ['Figma Advanced', 'Design Systems'],
        projects: ['Mobile App UI Kit'],
        dependsOn: ['node-2'],
        position: { x: 0, y: 0 }
      },
      {
        id: 'node-des-2',
        skill: 'UX Research & Testing',
        level: CourseLevel.ADVANCED,
        status: 'locked',
        courses: ['Usability Testing', 'Product Psychology'],
        projects: ['User Research Case Study'],
        dependsOn: ['node-des-1'],
        position: { x: 0, y: 0 }
      }
    ];
  } else {
    specializedNodes = [
      {
        id: 'node-gen-1',
        skill: 'Domain Leadership',
        level: CourseLevel.INTERMEDIATE,
        status: 'locked',
        courses: ['Strategy & Execution', 'Team Dynamics'],
        projects: ['Business Plan'],
        dependsOn: ['node-2'],
        position: { x: 0, y: 0 }
      },
      {
        id: 'node-gen-2',
        skill: 'Innovation & Growth',
        level: CourseLevel.ADVANCED,
        status: 'locked',
        courses: ['Product Growth', 'AI Transformation'],
        projects: ['Growth Hack Campaign'],
        dependsOn: ['node-gen-1'],
        position: { x: 0, y: 0 }
      }
    ];
  }

  return {
    ...baseRoadmap,
    nodes: [...commonNodes, ...specializedNodes]
  } as SkillRoadmap;
};

export const roadmapService = {
  generatePersonalizedRoadmap
};
