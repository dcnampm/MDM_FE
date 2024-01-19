import React from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';
import { PaletteTree } from './palette';
import Signin from '../containers/Signin';

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path='/Signin'>
        <Signin />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;