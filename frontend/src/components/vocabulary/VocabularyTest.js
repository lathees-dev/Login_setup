import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Paper,
} from '@mui/material';
import axios from '../../config/axios';

const VocabularyTest = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/vocabulary/api/generate-question/');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const submitAnswer = (selected) => {
        setSelectedAnswer(selected);
        setShowAnswer(true);
        if (selected === questions[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setShowAnswer(false);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (questions.length === 0) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h6">No questions available. Please try again later.</Typography>
                </Box>
            </Container>
        );
    }

    if (currentQuestionIndex >= questions.length) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h4">Test Complete!</Typography>
                    <Typography variant="h6">Your Score: {score} out of {questions.length}</Typography>
                    <Button variant="contained" onClick={() => window.location.reload()}>Restart Test</Button>
                </Box>
            </Container>
        );
    }

    const question = questions[currentQuestionIndex];

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5">{question.sentence}</Typography>
                <div className="options">
                    {question.options.map((option) => (
                        <Button
                            key={option}
                            variant="contained"
                            onClick={() => submitAnswer(option)}
                            disabled={showAnswer}
                            sx={{ margin: '10px' }}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
                {showAnswer && (
                    <Paper sx={{ padding: 2, marginTop: 2 }}>
                        <Typography variant="body1">
                            {selectedAnswer === question.correct_answer
                                ? `Correct! Great job! Explanation: ${question.explanation}`
                                : `Wrong! The correct answer is '${question.correct_answer}'. Explanation: ${question.explanation}`}
                        </Typography>
                    </Paper>
                )}
                {showAnswer && (
                    <Button variant="contained" onClick={handleNextQuestion} sx={{ marginTop: 2 }}>
                        Next Question
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default VocabularyTest; 