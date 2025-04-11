import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  IconButton,
  useTheme,
  Button,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Book as BookIcon,
  PlayCircle as VideoIcon,
  Description as PDFIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Subject, Chapter, Resource, UserData } from '../../types';
import { getSubjects, getChapters } from '../../services/api';
import ResourceViewer from './ResourceViewer';

// Resource type icons mapping
const resourceIcons = {
  text: <BookIcon />,
  video: <VideoIcon />,
  pdf: <PDFIcon />,
  image: <ImageIcon />,
  link: <LinkIcon />,
  quiz: <QuizIcon />,
  assignment: <AssignmentIcon />,
  practice: <SchoolIcon />,
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}') as UserData;
  const { username, grade_level } = userData;

  // Fetch subjects for the selected grade level
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useQuery<Subject[]>(
    ['subjects', grade_level],
    () => getSubjects(grade_level),
    {
      enabled: !!grade_level,
      retry: 2,
      onError: (error: Error) => {
        console.error('Failed to fetch subjects:', error);
      },
    }
  );

  // Fetch chapters when a subject is selected
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useQuery<Chapter[]>(
    ['chapters', selectedSubject],
    () => getChapters(selectedSubject!),
    {
      enabled: !!selectedSubject,
      retry: 2,
      onError: (error: Error) => {
        console.error('Failed to fetch chapters:', error);
      },
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  if (!username || !grade_level) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Session expired. Please log in again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header with Logout */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Grade {grade_level} Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Grid>

        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome back, {username}!
            </Typography>
            <Typography variant="subtitle1">
              Continue your learning journey. You've completed 65% of your current chapter.
            </Typography>
            <LinearProgress
              variant="determinate"
              value={65}
              sx={{ mt: 2, mb: 1, height: 10, borderRadius: 5 }}
            />
          </Paper>
        </Grid>

        {/* Subjects Grid */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Your Subjects
          </Typography>
          {subjectsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load subjects. Please try again later.
            </Alert>
          )}
          <Grid container spacing={3}>
            {subjectsLoading ? (
              // Loading skeletons
              Array.from(new Array(3)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={140} />
                    <CardContent>
                      <Skeleton variant="text" height={32} />
                      <Skeleton variant="text" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              subjects?.map((subject) => (
                <Grid item xs={12} sm={6} md={4} key={subject.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[8],
                      },
                      border: selectedSubject === subject.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                    }}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 140,
                        backgroundColor: theme.palette.primary.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BookIcon sx={{ fontSize: 60, color: 'white' }} />
                    </CardMedia>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {subject.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {subject.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>

        {/* Chapters and Resources */}
        {selectedSubject && (
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Chapters
            </Typography>
            {chaptersError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load chapters. Please try again later.
              </Alert>
            )}
            {chaptersLoading ? (
              // Loading skeletons
              Array.from(new Array(2)).map((_, index) => (
                <Paper key={index} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {Array.from(new Array(3)).map((_, resIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={resIndex}>
                        <Skeleton variant="rectangular" height={80} />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              ))
            ) : (
              chapters?.map((chapter) => (
                <Paper
                  key={chapter.id}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {chapter.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {chapter.description}
                  </Typography>
                  
                  {/* Resources Grid */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {chapter.resources.map((resource) => (
                      <Grid item xs={12} sm={6} md={4} key={resource.id}>
                        <Card
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                          onClick={() => setSelectedResource(resource)}
                        >
                          <IconButton color="primary" sx={{ mr: 2 }}>
                            {resourceIcons[resource.resource_type]}
                          </IconButton>
                          <Box>
                            <Typography variant="subtitle1">{resource.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {resource.description}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              ))
            )}
          </Grid>
        )}
      </Grid>

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <ResourceViewer
          open={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          resource={selectedResource}
        />
      )}
    </Container>
  );
};

export default Dashboard; 