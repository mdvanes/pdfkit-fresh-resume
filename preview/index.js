import {convertedPfdDataURL} from './generated-pdf-as-blob';

document.write('<iframe width="600px" height="855px" src="#"></iframe>');

const iframe = document.querySelector('iframe');
iframe.src = convertedPfdDataURL;