import { OpaqueToken } from '@angular/core';

import {LANG_EN_NAME, LANG_EN_TRANS} from './lang-en';
import {LANG_KR_NAME, LANG_KR_TRANS} from './lang-kr';

export const TRANSLATIONS = new OpaqueToken('translations');

const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_KR_NAME]: LANG_KR_TRANS,
};

export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary},
];