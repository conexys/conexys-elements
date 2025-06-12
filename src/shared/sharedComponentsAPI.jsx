/**
 * @fileoverview API de componentes compartidos para plugins
 * 
 * @module shared/sharedComponentsAPI
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 1.0.0
 * @requires react
 * @requires ../components/theme/Loading
 * @requires ../components/AppSetHeaderTitle
 */

import React, { createElement } from 'react';
import { Loading } from '../components/theme/index';
//import { AppSetHeaderTitle } from '../components/index';

/**
 * Inicializa y expone los componentes compartidos en el objeto window
 */
export const initializeSharedComponents = () => {
    // Evitar reinicialización si ya existe
    if (window.conexysComponents) return;
    
    // Objeto de componentes compartidos
    window.conexysComponents = {
        // Componentes de UI
        UI: {
            Loading
        },
        // Factory functions para renderizar componentes con props específicas
        createLoading: (props) => {
            return createElement(Loading, props);
        },

        // Versión y metadatos
        version: '1.0.0',
        releaseDate: '2025-05-21'
    };
    if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
        console.log('%c [Conexys] [Shared Components] ', 'color: #3498db', 'Components initialized and shared with plugins');
    };
};