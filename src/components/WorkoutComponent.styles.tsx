import { Card, Button, TextField } from '@mui/material';
import styled from 'styled-components';

// --- Styled Components ---
export const StyledCard = styled(Card)`
padding-right: 16px;
  margin-bottom: 20px;
  width: 100%;
  border-radius: 16px;
`;

export const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin-bottom: 12px;
  border-radius: 12px;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`;

export const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;

// Styled TextField for mobile-friendly input
export const MobileTextField = styled(TextField)`
  && {
    .MuiInputBase-input {
      font-size: 18 !important;
    }
    .MuiInputLabel-root {
      font-size: 18 !important;
      color: rgba(180, 180, 180, 0.7) !important; /* lighter and more transparent */
    }
    margin-bottom: 16px; /* Add space below each input */
    margin-right: 16px; /* Add space to the right of each input */
  }
`;

// Styled Button for mobile-friendly size
export const MobileButton = styled(Button)`
  && {
    min-width: 80px;

    padding-top: 4px;
    padding-bottom: 4px;
    width: auto;

    @media (max-width: 600px) {
      min-width: 120px;

      padding-top: 12px;
      padding-bottom: 12px;
      width: 100%;
      margin-top: 16px;
    }
  }
`;

export const RepsContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 21px;

  @media (min-width: 600px) {
    flex-direction: column;
    /* background-color: red; // for debugging, remove if not needed */
  }
`;
