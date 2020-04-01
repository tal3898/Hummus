import React from 'react';

const HummusContext = React.createContext();

const HummusProvider = HummusContext.Provider;
const HummusConsumer = HummusContext.Consumer;

export {HummusProvider, HummusConsumer}