# Ticket: FIN-004 - Desarrollar Ayudas Contextuales y Elementos Visuales para Datos Financieros

## Historia de Usuario Relacionada

Ingresar Datos Financieros Básicos (@docs/backlog/inputs-financieros/historia-usuario.md)

## Descripción

Implementar un sistema completo de ayudas contextuales, tooltips y elementos visuales para facilitar la comprensión de los conceptos financieros en el formulario. Crear contenido explicativo en lenguaje sencillo y no técnico, junto con mini-gráficos e iconos que ayuden a usuarios sin formación financiera.

## Tareas

- [ ] Redactar explicaciones claras y concisas para cada concepto financiero (ingresos, costes fijos, CAC, etc.)
- [ ] Crear ejemplos relevantes para cada campo del formulario
- [ ] Desarrollar componentes de tooltip/popover para mostrar las ayudas contextuales
- [ ] Diseñar mini-gráficos explicativos para conceptos como CAC, LTV, etc.
- [ ] Implementar iconos intuitivos para cada sección del formulario
- [ ] Crear archivo de contenido separado para facilitar futuras modificaciones en los textos
- [ ] Implementar tests de usabilidad para validar la claridad de las explicaciones

## Criterios de Aceptación Técnicos

- Las explicaciones deben usar lenguaje sencillo y no técnico
- Los tooltips deben ser accesibles y funcionar correctamente en dispositivos móviles
- Los elementos visuales deben ser consistentes con el diseño general
- Las ayudas contextuales no deben interrumpir el flujo de trabajo del usuario
- El contenido debe estar organizado de manera modular para facilitar cambios futuros
- Los iconos y gráficos deben aportar valor real a la comprensión de los conceptos

## Referencias Técnicas

- Implementar tooltips/popovers accesibles según estándares WCAG
- Utilizar SVG para iconos y mini-gráficos
- Organizar contenido en archivos JSON/MDX separados
- Utilizar TailwindCSS para estilos consistentes

## Dependencias

- Ticket FIN-002 (Componentes UI)
- Ticket FIN-003 (Gestión de Estado e Integración)

## Estimación

Medio (5h)

## Asignado a

TBD
