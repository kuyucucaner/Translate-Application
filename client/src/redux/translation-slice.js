import { createSlice } from '@reduxjs/toolkit';

const translationSlice = createSlice({
  name: 'translation',
  initialState: {
    text: '',
    targetLanguage: 'en',
    translatedText: '',
    ocrDetectedText: '',
    analysis: {}, // Analiz sonuçları
    sentiment: {},

  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setTargetLanguage: (state, action) => {
      state.targetLanguage = action.payload;
    },
    setTranslatedText: (state, action) => {
      state.translatedText = action.payload;
    },
    setocrDetectedText: (state, action) => {
      state.ocrDetectedText = action.payload;
    },
    setAnalysis: (state, action) => {
      state.analysis = action.payload;
    },  
    setSentiment: (state, action) => {
      state.sentiment = action.payload;
    },
  },
});

export const { setText, setTargetLanguage, setTranslatedText  ,setocrDetectedText ,setAnalysis , setSentiment} = translationSlice.actions;
export default translationSlice.reducer;
