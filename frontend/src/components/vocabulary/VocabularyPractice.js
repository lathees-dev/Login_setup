import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    ButtonGroup,
    Paper,
} from '@mui/material';
import axios from '../../config/axios';
import { styled } from '@mui/material/styles';

const OptionButton = styled(Button)(({ isCorrect, isSelected }) => ({
    width: '100%',
    margin: '10px 0',
    backgroundColor: isSelected ? (isCorrect ? '#4caf50' : '#f44336') : '#1976d2',
    color: 'white',
    '&:hover': {
        backgroundColor: isSelected ? (isCorrect ? '#388e3c' : '#d32f2f') : '#1565c0',
    },
}));

const AnswerBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
}));

const VocabularyPractice = () => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, []);

    const fetchQuestion = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/vocabulary/api/generate-question/');
            setQuestion(response.data);
            setMessage('');
            setSelectedAnswer(null);
            setShowAnswer(false);
        } catch (error) {
            console.error('Error fetching question:', error);
            setMessage('Failed to load question.');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = (selected) => {
        setSelectedAnswer(selected);
        setShowAnswer(true);
    };

    const handleNextQuestion = () => {
        fetchQuestion();
    };

    const handleTryAgain = () => {
        setSelectedAnswer(null);
        setShowAnswer(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4, textAlign: 'center' }}>
                {question ? (
                    <div className="question-container">
                        <Typography variant="h5" className="question">{question.sentence}</Typography>
                        <div className="options" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            {question.options.map((option) => (
                                <OptionButton
                                    key={option}
                                    variant="contained"
                                    onClick={() => submitAnswer(option)}
                                    isCorrect={option === question.correct_answer}
                                    isSelected={selectedAnswer === option}
                                    disabled={showAnswer}
                                >
                                    {option}
                                </OptionButton>
                            ))}
                        </div>
                        {showAnswer && (
                            <AnswerBox>
                                <Typography variant="body1">
                                    {selectedAnswer === question.correct_answer
                                        ? `Correct! Great job! Explanation: ${question.explanation}`
                                        : `Wrong! The correct answer is '${question.correct_answer}'. Explanation: ${question.explanation}`}
                                </Typography>
                            </AnswerBox>
                        )}
                        <ButtonGroup variant="contained" sx={{ mt: 2 }}>
                            <Button onClick={handleNextQuestion} disabled={!showAnswer}>
                                Next Question
                            </Button>
                            <Button onClick={handleTryAgain} disabled={!showAnswer}>
                                Try Again
                            </Button>
                        </ButtonGroup>
                    </div>
                ) : (
                    <Typography variant="h6">{message}</Typography>
                )}
            </Box>
        </Container>
    );
};

export default VocabularyPractice; 