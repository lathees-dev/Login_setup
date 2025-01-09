import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#fff',
}));

const Tip = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const VideoCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  '& img': {
    width: '100%',
    borderRadius: theme.spacing(1),
  },
  '& .caption': {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
}));

const StoryTellingLearn = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Content data
  const chapters = [
    {
      title: "Introduction to Storytelling",
      content: [
        {
          title: "What is Storytelling?",
          content: introductoryContent,
          description: "Understanding the fundamentals of storytelling and its importance"
        },
        {
          title: "The Power of Stories",
          content: "Stories are a bridge between the logical and emotional parts of the human brain...",
          description: "Explore how stories impact our minds and emotions"
        }
      ]
    },
    {
      title: "Foundations",
      content: [
        {
          title: "Core Elements",
          elements: coreElements,
          description: "Master these fundamental building blocks of storytelling."
        },
        {
          title: "Story Structure",
          image: "/images/story-structure.png",
          description: "Understanding the classic three-act structure and its variations."
        }
      ]
    },
    {
      title: "Advanced Techniques",
      content: [
        {
          title: "The Hero's Journey",
          stages: heroJourneyStages,
          image: "/images/monomyth1.png"
        },
        {
          title: "Character Development",
          techniques: characterDevelopmentTips
        }
      ]
    },
    {
      title: "Professional Tips",
      content: professionalTips
    },
    {
      title: "Professional Applications",
      content: [
        {
          title: "Career Success Through Storytelling",
          content: careerApplications,
          description: "Learn how to use storytelling in your professional life"
        },
        {
          title: "Practical Exercises",
          content: practicalExercises,
          description: "Hands-on activities to improve your storytelling skills"
        }
      ]
    }
  ];

  const videos = [
    {
      id: "P2CVIGuRg4E",
      title: "The Art of Storytelling",
      description: "Learn the fundamentals of engaging storytelling",
      thumbnail: "/images/video-thumb1.jpg"
    },
    {
      id: "Nj-hdQMa3uA",
      title: "Voice and Expression",
      description: "Master the art of vocal delivery",
      thumbnail: "/images/video-thumb2.jpg"
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigate('/story-telling')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            The Professional Storyteller&apos;s Handbook
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Learn" />
            <Tab label="Practice" />
            <Tab label="Resources" />
          </Tabs>
        </Box>

        {/* Content based on current tab */}
        {currentTab === 0 && (
          <>
            {chapters.map((chapter, index) => (
              <Section key={index}>
                <Typography variant="h5" gutterBottom>
                  Chapter {index + 1}: {chapter.title}
                </Typography>
                
                {chapter.content.map((section, sectionIndex) => (
                  <Accordion key={sectionIndex} defaultExpanded={sectionIndex === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{section.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ mb: 3 }}>
                        <Typography paragraph>{section.description}</Typography>
                        
                        {section.image && (
                          <ImageContainer>
                            <img src={section.image} alt={section.title} />
                            <Typography className="caption">
                              {section.title} Diagram
                            </Typography>
                          </ImageContainer>
                        )}
                        
                        {section.elements && (
                          <Grid container spacing={3}>
                            {section.elements.map((element) => (
                              <Grid item xs={12} md={4} key={element.title}>
                                <Card elevation={2}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary">
                                      {element.title}
                                    </Typography>
                                    <Typography variant="body2">
                                      {element.desc}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Section>
            ))}

            {/* Video Resources Section */}
            <Section>
              <Typography variant="h5" gutterBottom>
                Video Resources
              </Typography>
              <Grid container spacing={3}>
                {videos.map((video) => (
                  <Grid item xs={12} md={6} key={video.id}>
                    <VideoCard>
                      <CardMedia
                        component="iframe"
                        height="315"
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {video.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {video.description}
                        </Typography>
                      </CardContent>
                    </VideoCard>
                  </Grid>
                ))}
              </Grid>
            </Section>

            {/* Interactive Examples Section */}
            <Section>
              <Typography variant="h5" gutterBottom>
                Interactive Examples
              </Typography>
              {/* Add interactive examples here */}
            </Section>
          </>
        )}

        {currentTab === 1 && (
          <Section>
            <Typography variant="h5" gutterBottom>
              Practice Exercises
            </Typography>
            {/* Add practice exercises here */}
          </Section>
        )}

        {currentTab === 2 && (
          <Section>
            <Typography variant="h5" gutterBottom>
              Additional Resources
            </Typography>
            {/* Add resources here */}
          </Section>
        )}
      </Box>
    </Container>
  );
};

// Data
const coreElements = [
  { 
    title: 'Character',
    desc: "The protagonist who embodies the story's theme",
    details: `Characters are the heart of any story. A well-developed character needs:
    • Clear motivations that drive their actions
    • Distinct personality traits and quirks
    • Internal and external conflicts
    • A background story that shapes their worldview
    • Relationships that influence their decisions
    • Growth potential throughout the story
    
    Strong characters make readers invest emotionally in your story. They should feel real, with both strengths and flaws, hopes and fears.`
  },
  { 
    title: 'Setting',
    desc: 'Time and place where the story unfolds',
    details: `The setting is more than just a backdrop. It should:
    • Create atmosphere and mood
    • Influence character behavior and choices
    • Provide context for the story's events
    • Add authenticity to the narrative
    • Create constraints or opportunities for the plot
    
    A well-crafted setting can become almost like another character in your story, shaping events and influencing outcomes.`
  },
  { 
    title: 'Conflict',
    desc: 'The challenge or problem faced by the protagonist',
    details: `Conflict drives the story forward. Types of conflict include:
    • Internal: Character vs. Self (moral dilemmas, personal growth)
    • External: Character vs. Others (interpersonal struggles)
    • Environmental: Character vs. Nature/Society
    • Multiple Layers: Combining different types of conflict
    
    Without conflict, there's no story. It creates tension, drives character development, and keeps readers engaged.`
  },
  { 
    title: 'Resolution',
    desc: 'The outcome or transformation resulting from the conflict',
    details: `A satisfying resolution should:
    • Address the main conflict meaningfully
    • Show character growth or change
    • Tie up major plot threads
    • Feel earned, not forced
    • Leave an impact on the reader
    
    The resolution doesn't always mean a happy ending, but it should provide closure and satisfaction.`
  },
  { 
    title: 'Theme',
    desc: 'The underlying message or moral of the story',
    details: `Theme is the deeper meaning behind your story:
    • Universal truths about human nature
    • Social commentary or criticism
    • Moral lessons or ethical questions
    • Philosophical ideas or concepts
    
    A strong theme makes your story memorable and gives it lasting impact beyond mere entertainment.`
  }
];

const storyStructures = {
  threeAct: {
    title: "Three-Act Structure",
    description: `The classic three-act structure is the foundation of most stories:

    Act 1 - Setup (25% of story)
    • Introduce main characters and their normal world
    • Establish the tone and setting
    • Present the inciting incident
    • End with the first plot point that launches the main conflict

    Act 2 - Confrontation (50% of story)
    • Develop conflicts and raise stakes
    • Present obstacles and complications
    • Show character growth and changes
    • Build to a midpoint twist
    • Lead to the darkest moment/lowest point

    Act 3 - Resolution (25% of story)
    • Climactic confrontation
    • Resolution of conflicts
    • Character transformation
    • Tying up loose ends
    • Final impact or message`,
    tips: [
      "Each act should flow naturally into the next",
      "Maintain rising tension throughout",
      "Include smaller conflicts within each act",
      "End each act with a significant event or revelation"
    ]
  }
};

const characterDevelopmentTips = [
  {
    title: "Character Depth",
    description: "Create multi-dimensional characters with clear motivations, flaws, and growth potential.",
    details: `Building Complex Characters:

    1. Background & History
    • Family relationships and dynamics
    • Significant past events that shaped them
    • Cultural and social influences
    • Education and experiences

    2. Personality Traits
    • Core values and beliefs
    • Habits and mannerisms
    • Likes and dislikes
    • Strengths and weaknesses

    3. Internal Landscape
    • Fears and insecurities
    • Dreams and aspirations
    • Internal conflicts
    • Personal biases

    4. External Relationships
    • Friends and enemies
    • Professional connections
    • Romantic interests
    • Family ties

    5. Growth Potential
    • Areas for development
    • Learning opportunities
    • Character arcs
    • Transformation points`
  },
  {
    title: "Character Arc",
    description: "Plan how your character will change throughout the story.",
    details: `Types of Character Arcs:

    1. Positive Arc (Most Common)
    • Character overcomes flaws
    • Learns important lessons
    • Grows stronger/wiser
    • Achieves goals through change

    2. Negative Arc
    • Character fails to overcome flaws
    • Makes increasingly poor choices
    • Descends into corruption
    • Tragic consequences

    3. Flat Arc
    • Character remains steadfast
    • Changes the world around them
    • Maintains core beliefs
    • Proves their worldview correct

    Key Elements of a Strong Arc:
    • Clear starting point
    • Catalysts for change
    • Meaningful challenges
    • Consistent progression
    • Satisfying conclusion`
  }
];

const professionalTips = [
  {
    title: "Voice and Expression",
    content: "Master the art of vocal delivery with proper pacing, tone, and emphasis.",
    details: `Mastering Vocal Delivery:

    1. Pitch and Tone
    • Vary pitch for different characters
    • Use tone to convey emotions
    • Adjust volume for emphasis
    • Maintain clarity and projection

    2. Pacing and Rhythm
    • Speed up for excitement
    • Slow down for tension
    • Use pauses effectively
    • Match rhythm to mood

    3. Emphasis and Stress
    • Highlight key words
    • Build to climactic moments
    • Create contrast
    • Use silence for impact`
  },
  {
    title: "Body Language",
    content: "Use gestures and facial expressions to enhance your storytelling.",
    details: `Effective Physical Storytelling:

    1. Facial Expressions
    • Match emotions of the story
    • Show reactions naturally
    • Maintain eye contact
    • Use micro-expressions

    2. Hand Gestures
    • Emphasize key points
    • Illustrate descriptions
    • Show size and movement
    • Create visual focus

    3. Body Positioning
    • Open stance for engagement
    • Movement for energy
    • Posture for authority
    • Space for dynamics`
  }
];

// Add practice exercises
const practiceExercises = [
  {
    title: "Character Building Exercise",
    instructions: "Create a character profile using the following prompts...",
    prompts: [
      "What is your character's biggest fear?",
      "Describe a defining moment from their past",
      "What is their greatest desire?",
      // Add more prompts
    ]
  },
  // Add more exercises
];

// Add additional resources
const additionalResources = [
  {
    title: "Books on Storytelling",
    items: [
      "The Hero with a Thousand Faces by Joseph Campbell",
      "Story by Robert McKee",
      "On Writing by Stephen King",
      // Add more books
    ]
  },
  // Add more resource categories
];

const heroJourneyStages = [
  'Ordinary World',
  'Call to Adventure',
  'Refusal of the Call',
  'Meeting the Mentor',
  'Crossing the Threshold',
  'Trials, Allies, Enemies',
  'The Ordeal',
  'Reward',
  'The Road Back',
  'Resurrection',
  'Return with the Elixir'
];

// Add new content sections
const introductoryContent = {
  title: "What is Storytelling?",
  content: `Storytelling is the art of sharing ideas, emotions, and narratives through spoken, written, or visual means. It's a way to captivate an audience by weaving a sequence of events or a message into a structured and engaging form, often with a beginning, middle, and end. Storytelling can entertain, educate, inspire, or convey complex ideas in a relatable and memorable way.`,
  importance: [
    {
      title: "Enhances Communication Skills",
      details: "Storytelling teaches students how to express themselves clearly and confidently. It improves verbal and non-verbal communication, critical for presentations, interviews, and teamwork."
    },
    {
      title: "Boosts Creativity and Imagination",
      details: "Encourages students to think creatively, come up with unique ideas, and explore different perspectives."
    },
    {
      title: "Builds Empathy and Emotional Intelligence",
      details: "By stepping into the shoes of a story's characters, students develop a deeper understanding of emotions, relationships, and diverse cultures."
    },
    {
      title: "Strengthens Analytical and Problem-Solving Skills",
      details: "Stories often involve conflicts and resolutions, which can help students learn how to analyze problems and find solutions."
    },
    {
      title: "Makes Learning Memorable",
      details: "Concepts and lessons embedded in stories are easier to remember and internalize than abstract theories."
    },
    {
      title: "Prepares for Professional Success",
      details: "In careers, storytelling is critical for effective presentations, marketing, networking, and leadership. Professionals often use storytelling to pitch ideas, convey visions, or connect with clients."
    }
  ]
};

const storytellingRules = [
  {
    title: "Know Your Audience",
    details: `• Tailor your story to the interests, age, and background of your audience
    • Use language, examples, and themes that resonate with them`
  },
  {
    title: "Start with a Strong Hook",
    details: `• Capture attention from the very beginning with a question, an interesting fact, or an intriguing event
    • Example: "What if you woke up one day and the sky wasn't blue anymore, but green?"`,
    example: true
  },
  {
    title: "Create a Clear Structure",
    details: `• Beginning: Set the scene and introduce the characters and situation
    • Middle: Introduce a conflict or challenge, building suspense
    • End: Resolve the conflict and provide closure`
  },
  // ... Add more rules from the content
];

const careerApplications = {
  title: "Applying Storytelling in Your Career",
  sections: [
    {
      title: "Job Interviews",
      content: "Use storytelling to narrate experiences, achievements, or problem-solving examples. For instance: 'Let me tell you about the time I led a team during a college hackathon...'"
    },
    {
      title: "Presentations and Public Speaking",
      content: "Storytelling adds a human touch to technical or business presentations, making them engaging."
    },
    // ... Add more career applications
  ]
};

const practicalExercises = [
  {
    title: "Creative Writing",
    description: "Write short stories on a given theme",
    instructions: "Choose a theme from the list below and write a story incorporating the storytelling elements we've discussed.",
    themes: ["Overcoming Fear", "First Day", "Unexpected Discovery"]
  },
  {
    title: "Role-Playing",
    description: "Act out stories to improve communication and empathy",
    instructions: "Work with a partner to act out one of the following scenarios...",
    scenarios: ["Job Interview", "Client Presentation", "Team Conflict Resolution"]
  },
  // ... Add more exercises
];

export default StoryTellingLearn; 