# Registro de pruebas del procesamiento

Asistente Inteligente para la Innovación Pública Local · Ashanti Perú

Elaborado por Luis Alberto Vargas Tupac · 10 de noviembre de 2026

## 1. Qué se probó y cómo

Se probó el procesamiento completo de la herramienta: registro de la persona, formulario guía, selección de fichas según los ejes marcados, redacción de la hoja de recomendaciones por el modelo Claude Sonnet 5.5 y cálculo del costo de cada consulta. Cada prueba se hizo contra la función real publicada en Supabase, con la clave de API de prueba.

Se diseñaron seis casos: tres del perfil Autoridades y funcionarios municipales y tres del perfil Sociedad civil, en cinco departamentos (Ayacucho, Lima, Ica, Cusco y Puno). Dos casos se diseñaron para poner a prueba el criterio del asistente: el caso A3 pide cifras que las fichas no contienen, para verificar que el asistente no las invente, y el caso S2 es una consulta vaga, para verificar que igual entregue un punto de partida útil.

Los mismos seis casos se corrieron en cuatro rondas. Entre una ronda y la siguiente se ajustaron las instrucciones del asistente según lo observado en las hojas.

## 2. Casos de prueba

| Caso | Perfil | Institución y departamento | Ejes marcados | Propósito de la prueba |
|---|---|---|---|---|
| A1 | Autoridades y funcionarios municipales | Municipalidad Provincial de Huamanga, Ayacucho | Participación juvenil; Interculturalidad/Pertinencia territorial | Caso completo con dos ejes y texto propio |
| A2 | Autoridades y funcionarios municipales | Municipalidad Distrital de El Agustino, Lima | Fortalecimiento democrático; Participación ciudadana | Dos ejes, sin texto propio |
| A3 | Autoridades y funcionarios municipales | Municipalidad Distrital de El Carmen, Ica | Lucha contra la discriminación | Pide cifras que las fichas no contienen |
| S1 | Sociedad civil | Colectivo de jóvenes afroperuanas (independiente), Lima | Lucha contra la discriminación; Enfoque de género | Dos ejes, propuesta para llevar a la autoridad |
| S2 | Sociedad civil | independiente, Cusco | Participación juvenil | Consulta vaga, con pocas condiciones |
| S3 | Sociedad civil | Federación de comunidades campesinas, Puno | Participación ciudadana; Interculturalidad/Pertinencia territorial | Comunidades aimaras, barreras de idioma y lectura |

El detalle de lo que se respondió en el formulario guía para cada caso está en el anexo A.

## 3. Rondas de prueba y ajustes

| Ronda | Instrucciones | Qué se cambió antes de la ronda |
|---|---|---|
| 1 | Versión 1 | Primera versión de las instrucciones, con la estructura de seis secciones del plan de trabajo y reglas de redacción. |
| 2 | Versión 2 | Encabezado con formato único; citas con el nombre exacto de la ficha; propuestas para Lima y Huamanga solo si la persona es de esos departamentos; redacción sin suponer el género de la persona; extensión de 650 a 950 palabras. |
| 3 | Versión 3 | Extensión de 400 a 600 palabras; una o dos fichas por hoja; tres recomendaciones de dos oraciones cada una. Se corrió con cuatro casos. |
| 4 | Versión 4 | Las referencias las arma la herramienta desde la base de datos y no el modelo, para que salgan exactas y la consulta cueste menos; resumen de la consulta de hasta 50 palabras; exactamente tres recomendaciones; se quitó del contexto lo que no se usa para recomendar (reconocimiento, desafío inicial y fuentes). |

Antes de la ronda 1 se corrigieron tres problemas técnicos: el nombre del secreto de la clave de API, un parámetro que el modelo ya no acepta (temperatura) y una primera respuesta vacía porque el modelo usaba todo su espacio en razonar antes de escribir.

## 4. Resultados por ronda

| Ronda | Palabras por hoja (promedio) | Tiempo de respuesta (promedio) | Costo por consulta (promedio) | Rango de costo |
|---|---|---|---|---|
| 1 | 1 125 | 19,6 s | US$ 0,077 | US$ 0,052 a 0,093 |
| 2 | 973 | 17,3 s | US$ 0,072 | US$ 0,051 a 0,087 |
| 3 | 688 | 12,8 s | US$ 0,061 | US$ 0,044 a 0,073 |
| 4 | 595 | 9,5 s | US$ 0,041 | US$ 0,028 a 0,052 |

Detalle por caso:

| Caso | Ronda 1 | Ronda 2 | Ronda 3 | Ronda 4 |
|---|---|---|---|---|
| A1 | 1318 palabras · 22,6 s · US$ 0,088 | 1209 palabras · 20,5 s · US$ 0,084 | 772 palabras · 13,8 s · US$ 0,066 | 648 palabras · 9,7 s · US$ 0,043 |
| A2 | 1094 palabras · 19,0 s · US$ 0,093 | 910 palabras · 16,9 s · US$ 0,087 | no se corrió | 570 palabras · 9,5 s · US$ 0,052 |
| A3 | 1041 palabras · 17,3 s · US$ 0,063 | 945 palabras · 16,4 s · US$ 0,062 | 523 palabras · 9,9 s · US$ 0,044 | 610 palabras · 9,4 s · US$ 0,035 |
| S1 | 1210 palabras · 21,0 s · US$ 0,077 | 1021 palabras · 18,3 s · US$ 0,070 | 757 palabras · 14,5 s · US$ 0,060 | 640 palabras · 9,5 s · US$ 0,040 |
| S2 | 974 palabras · 17,1 s · US$ 0,052 | 894 palabras · 16,4 s · US$ 0,051 | no se corrió | 513 palabras · 8,2 s · US$ 0,028 |
| S3 | 1114 palabras · 20,5 s · US$ 0,088 | 860 palabras · 15,1 s · US$ 0,079 | 698 palabras · 12,8 s · US$ 0,073 | 589 palabras · 10,4 s · US$ 0,049 |

## 5. Lo que se observó

- **Estructura.** En las 22 hojas generadas aparecen las seis secciones en el orden acordado. Ninguna hoja citó una ficha que no correspondiera a los ejes marcados.
- **Sin datos inventados.** En el caso A3, la persona pidió el costo del centro de Goiás y el número de mujeres atendidas. En las cuatro rondas el asistente respondió que las fuentes de la Caja de Herramientas no contienen esas cifras y sugirió pedirlas directamente al municipio de Goiás.
- **Consulta vaga.** En el caso S2 el asistente propuso un punto de partida concreto (reunir a compañeros universitarios y pedir una reunión con el área de juventud) y un texto para presentar al alcalde.
- **Pertinencia territorial.** En la ronda 1 el asistente mencionaba las propuestas para Huamanga en casos de Cusco y Puno. Desde la ronda 2 las propuestas para Lima y Huamanga solo aparecen cuando la persona es de esos departamentos. En el caso de Puno el asistente reconoció que se trata de comunidades aimaras y propuso materiales visuales para mujeres que no leen.
- **Extensión.** Las hojas de la ronda 1 tenían en promedio 1 125 palabras, demasiado para una lectura rápida. En la ronda 4 bajaron a unas 595 palabras con las referencias (unas 460 sin ellas), lo que equivale a una página y media en A4.
- **Costo.** El costo por consulta bajó de US$ 0,077 en la ronda 1 a US$ 0,041 en la ronda 4. Con este costo, 100 consultas cuestan alrededor de US$ 4 y un presupuesto de US$ 20 al mes alcanza para unas 480 consultas.
- **Tiempo de respuesta.** Bajó de unos 20 segundos a unos 10 segundos.

## 6. Pendientes para la ronda de ajustes (miércoles 11 a viernes 13)

- Revisar con Ashanti Perú el tono y la extensión de la hoja sobre los ejemplos de la ronda 4.
- Incorporar los documentos de contexto que envíe Ashanti Perú y medir cuánto suben el costo por consulta.
- Repetir los seis casos con las instrucciones finales y registrar la ronda 5.

## Anexo A. Lo que se respondió en el formulario guía

### Caso A1

- Perfil: Autoridades y funcionarios municipales
- Institución: Municipalidad Provincial de Huamanga
- Cargo o rol: Subgerente de Participación Vecinal
- Departamento: Ayacucho
- Ejes: Participación juvenil; Interculturalidad/Pertinencia territorial
- Población: Jóvenes de 16 a 29 años de comunidades quechuahablantes y barrios periféricos
- Lo que quiere lograr: Que los jóvenes propongan y decidan parte del presupuesto participativo 2027
- Prioridades: El proceso de presupuesto participativo de marzo de 2027
- Condiciones: Equipo de tres personas, sin partida propia; aliados: la UNSCH y dos colectivos juveniles
- Texto propio: Las convocatorias salen en castellano y por Facebook. Proyectos aprobados en años anteriores no se ejecutaron y la gente desconfía.

### Caso A2

- Perfil: Autoridades y funcionarios municipales
- Institución: Municipalidad Distrital de El Agustino
- Cargo o rol: Regidor
- Departamento: Lima
- Ejes: Fortalecimiento democrático; Participación ciudadana
- Población: Juntas vecinales y organizaciones afroperuanas del distrito
- Lo que quiere lograr: Reactivar las juntas vecinales y que la municipalidad responda a sus pedidos
- Prioridades: Seguridad y limpieza de espacios públicos
- Condiciones: Sin presupuesto adicional; hay un área de participación vecinal con dos personas
- Texto propio: (sin texto propio)

### Caso A3

- Perfil: Autoridades y funcionarios municipales
- Institución: Municipalidad Distrital de El Carmen
- Cargo o rol: Gerente de Desarrollo Social
- Departamento: Ica
- Ejes: Lucha contra la discriminación
- Población: Mujeres afroperuanas
- Lo que quiere lograr: Mejorar la atención a mujeres que denuncian violencia
- Prioridades: La DEMUNA y el CEM
- Condiciones: Personal reducido
- Texto propio: Queremos un centro como el de Goiás. ¿Cuánto cuesta y cuántas mujeres atendió?

### Caso S1

- Perfil: Sociedad civil
- Institución: Colectivo de jóvenes afroperuanas (independiente)
- Cargo o rol: Coordinadora
- Departamento: Lima
- Ejes: Lucha contra la discriminación; Enfoque de género
- Población: Mujeres jóvenes afroperuanas de Lima Metropolitana
- Lo que quiere lograr: Que la municipalidad atienda sin discriminación y derive bien los casos de violencia
- Prioridades: Gerencia de Desarrollo Social y mesa de concertación del distrito
- Condiciones: 15 integrantes, sin presupuesto; contacto con una red afroperuana y con el CEM
- Texto propio: Varias compañeras fueron a la municipalidad o a la comisaría y las trataron mal o las mandaron de un lado a otro. Queremos llevar una propuesta concreta.

### Caso S2

- Perfil: Sociedad civil
- Institución: independiente
- Cargo o rol: no indicado
- Departamento: Cusco
- Ejes: Participación juvenil
- Población: Jóvenes universitarios
- Lo que quiere lograr: Que haya un presupuesto para jóvenes
- Prioridades: El alcalde
- Condiciones: Ninguno
- Texto propio: No sé bien cómo empezar.

### Caso S3

- Perfil: Sociedad civil
- Institución: Federación de comunidades campesinas
- Cargo o rol: Secretaria de actas
- Departamento: Puno
- Ejes: Participación ciudadana; Interculturalidad/Pertinencia territorial
- Población: Comunidades aimaras de la zona rural
- Lo que quiere lograr: Que las mujeres de las comunidades participen en el presupuesto participativo con propuestas propias
- Prioridades: La municipalidad provincial y el comité de vigilancia
- Condiciones: Organización con 12 comunidades; el idioma y las distancias son barreras
- Texto propio: Las asambleas son en castellano y las mujeres casi no hablan. Algunas no saben leer.

## Anexo B. Hojas generadas en la ronda 4 (instrucciones versión 4, vigente)

#### Caso A1 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Provincial de Huamanga · Ayacucho · 10 de noviembre de 2026

##### 1. Su consulta
Desde la Subgerencia de Participación Vecinal, quiere que jóvenes de 16 a 29 años de comunidades quechuahablantes y barrios periféricos propongan y decidan parte del presupuesto participativo de marzo de 2027. Cuenta con tres personas, sin partida propia, y con la UNSCH y dos colectivos juveniles como aliados. Las convocatorias salen solo en castellano y por Facebook, y la desconfianza viene de proyectos aprobados que no se ejecutaron.

##### 2. Buenas prácticas que aplican
**GOP + Jovem, Vila Nova de Gaia (Portugal):** la municipalidad convoca propuestas juveniles, las somete a votación y financia las ganadoras con una partida definida. El parque multigeneracional de Serzedo, elegido en 2020, se inauguró en 2025; la nota municipal acredita esa obra, no el impacto de todo el programa. Sirve porque muestra qué puede decidir la juventud y cómo comunicar demoras.

**Participación de mujeres indígenas en Cotacachi (Ecuador):** el municipio abrió reuniones previas, en lengua originaria, para que las mujeres prepararan propuestas antes de la asamblea general. El reporte de 2006 no prueba continuidad actual ni impactos causales. Sirve porque ordena cómo preparar a un grupo que hoy no llega al proceso.

##### 3. Recomendaciones aplicables
1. **Delimite con su gerencia de presupuesto qué parte de 2027 decidirán los jóvenes y publique las reglas.** Un monto o una línea del presupuesto participativo, con edades y criterios de selección escritos, permite explicar qué se decide y responde a la desconfianza [Ficha 1, GOP + Jovem en Vila Nova de Gaia].
2. **Haga con los colectivos juveniles y la UNSCH reuniones preparatorias presenciales en barrios y comunidades, con facilitación en quechua.** Allí se formulan las propuestas antes de la asamblea, con una ficha sencilla (problema, solución, costo, población) y sin depender de Facebook [Ficha 5, Participación de mujeres indígenas en Cotacachi].
3. **Lleve un registro público de cada propuesta y de su respuesta municipal.** La matriz indica si fue aceptada, pendiente o rechazada y por qué, con hitos de ejecución y aviso de demoras. Es lo que puede restituir la confianza tras los proyectos que no se ejecutaron [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

##### 4. Por dónde empezar
1. Reúnase con la gerencia de presupuesto para acordar el alcance de un piloto juvenil: monto, edades y reglas.
2. Reúnase con los dos colectivos juveniles y la UNSCH para repartir quién facilita en quechua, quién convoca en cada zona y quién apoya a quienes formulan propuestas.
3. Reúnase con las áreas que ejecutarán obras para acordar la matriz de seguimiento y la fecha de la primera rendición de avances.

##### 5. Próximo paso
Esta semana, convoque a los dos colectivos juveniles y a un enlace de la UNSCH para fijar el calendario de reuniones preparatorias previas a marzo de 2027. Saldrá un acuerdo sobre zonas, facilitadores en quechua y fechas.

##### 6. Referencias

**Ficha 1. GOP + Jovem en Vila Nova de Gaia (Portugal)**

[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.

[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.

[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.

[4] Municipalidad de Gaia. Reglamentos y normas de participación.

[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**

[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.

[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A2 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Distrital de El Agustino · Lima · 10 de noviembre de 2026

##### 1. Su consulta
Como regidor de El Agustino, usted busca reactivar las juntas vecinales y lograr que la municipalidad responda a sus pedidos, con las organizaciones afroperuanas del distrito incluidas. Las prioridades son la seguridad y la limpieza de espacios públicos. No cuenta con presupuesto adicional y dispone de un área de participación vecinal de dos personas.

##### 2. Buenas prácticas que aplican
**Construyendo Ciudadanía (San Luis Potosí, México).** Organizó juntas por demarcaciones y las vinculó con diagnóstico, priorización y seguimiento de acciones municipales. La candidatura reporta 284 juntas constituidas y 390 espacios públicos rehabilitados, cifras declaradas por la propia postulación. Sirve porque conecta juntas con servicios concretos y con respuestas municipales [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].

**Participación de mujeres indígenas en Cotacachi (Ecuador).** Preparó la participación en reuniones propias antes de la instancia general y dio seguimiento a las propuestas. Es una sistematización de 2006, sin evidencia de continuidad actual. Aporta un método para incluir a organizaciones que hoy participan poco [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables
1. **Elija una junta vecinal existente y acuerde con el área municipal competente una reunión periódica.** El área de participación vecinal convoca y deja un registro público de solicitudes, responsables y fechas de respuesta, sin crear estructuras nuevas [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].
2. **Mapee las juntas e instancias vecinales que ya funcionan antes de crear otras.** Con seguridad y limpieza como prioridades, reactive primero las que existen y acuerde sus funciones, lo que se ajusta a un equipo de dos personas [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].
3. **Realice una reunión preparatoria con las organizaciones afroperuanas y una matriz de propuestas.** Anote para cada pedido si fue aceptado, pendiente o rechazado, con su razón, y pregunte a las participantes por horarios y otras barreras de asistencia [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar
1. Con el área de participación vecinal, elaborar la lista de juntas vecinales y organizaciones afroperuanas activas del distrito.
2. Con las áreas de seguridad ciudadana y limpieza pública, definir quién responde cada tipo de pedido y en cuántos días.
3. Con una junta y una organización afroperuana, hacer una primera reunión y abrir el registro público de solicitudes y respuestas.

##### 5. Próximo paso
Esta semana, reúnase con las dos personas del área de participación vecinal para listar las juntas existentes y escoger una con la cual convocar la primera reunión. El resultado esperado es una junta definida y una fecha acordada para esa reunión.

##### 6. Referencias

**Ficha 7. Construyendo Ciudadanía en San Luis Potosí (México)**

[1] OIDP (2025). San Luis Potosí gana la 19.ª Distinción por Construyendo Ciudadanía.

[2] Ayuntamiento de San Luis Potosí (2025). Candidatura Construyendo Ciudadanía ante el OIDP.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**

[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.

[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A3 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Distrital de El Carmen · Ica · 10 de noviembre de 2026

##### 1. Su consulta
Como Gerente de Desarrollo Social, quiere mejorar la atención a mujeres afroperuanas que denuncian violencia, tomando como referencia el centro de Goiás. Sus prioridades son la DEMUNA y el CEM, y cuenta con personal reducido. Pregunta cuánto cuesta ese centro y cuántas mujeres atendió.

##### 2. Buenas prácticas que aplican
**Centro Especializado de Atendimento à Mulher (CEAM) Brasilete Ramos Caiado**, municipio de Goiás, Brasil, activo desde 2013 y premiado por UNESCO en 2020. Ofrece orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, con charlas y talleres de prevención. Sirve a su caso porque muestra una atención articulada. Sobre su pregunta: las fuentes no desagregan presupuesto ni personal, y no publican cuántas mujeres atendió ni una reducción de la violencia atribuible al centro [Ficha 8, Atención integral a mujeres en Goiás].

**Participación de mujeres indígenas en Cotacachi**, Ecuador. Preparar la participación con espacios propios de mujeres, antes de la reunión general, ayudó a formular propuestas y a darles seguimiento. Sirve para acordar condiciones de acceso con las propias usuarias [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables
1. **La Gerencia de Desarrollo Social mapea los servicios existentes y define quién responde a qué.** Con personal reducido, conviene articular la DEMUNA, el CEM, salud y justicia, sin crear un servicio nuevo que duplique funciones [Ficha 8, Atención integral a mujeres en Goiás].
2. **La Gerencia codiseña con organizaciones de mujeres afroperuanas medidas de trato sin discriminación y de acceso.** Las barreras que ellas señalen (racismo, dependencia económica, desconfianza) orientan los ajustes. Este enfoque es una propuesta de adaptación, no una experiencia ejecutada en Perú [Ficha 8, Atención integral a mujeres en Goiás].
3. **La Gerencia registra las derivaciones y revisa si se completan.** Una matriz simple con la barrera, la respuesta y el responsable de seguimiento permite comprobar si la mujer llegó al servicio y fue bien tratada [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar
1. Reunirse con las personas responsables de la DEMUNA y del CEM para mapear la oferta, las responsabilidades de cada entidad y las derivaciones.
2. Convocar a organizaciones de mujeres afroperuanas para identificar una barrera de acceso y acordar con ellas una mejora de orientación o derivación.
3. Asegurar confidencialidad y consentimiento en cada derivación, junto con los servicios competentes del MIMP, salud y justicia.

##### 5. Próximo paso
Esta semana, convoque a la DEMUNA, al CEM y a una organización de mujeres afroperuanas para elegir una barrera de acceso y nombrar a quien dará seguimiento. Resultado esperado: una mejora concreta, acordada y con responsable.

##### 6. Referencias

**Ficha 8. Atención integral a mujeres en Goiás (Brasil)**

[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.

[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.

[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.

[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**

[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.

[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S1 · Hoja de recomendaciones

Sociedad civil · Colectivo de jóvenes afroperuanas (independiente) · Lima · 10 de noviembre de 2026

##### 1. Su consulta
Quieren que la municipalidad atienda sin discriminación a mujeres jóvenes afroperuanas de Lima Metropolitana y derive bien los casos de violencia. Varias compañeras fueron maltratadas o enviadas de un lugar a otro. Son 15 integrantes, sin presupuesto, con contacto con una red afroperuana y con el CEM.

##### 2. Buenas prácticas que aplican
**Centro Especializado de Atendimento à Mulher (CEAM)**, ciudad de Goiás, Brasil: el gobierno local ofrece orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia. La fuente acredita la oferta de servicios y el reconocimiento externo, pero no publica cifras de usuarias ni reducción de la violencia. Sirve a su caso porque trabaja la articulación de servicios y el enfoque interseccional [Ficha 8, Centro de atención a mujeres en Goiás].

**Participación de mujeres indígenas en Cotacachi**, Ecuador: preparó propuestas en reuniones propias de mujeres y las devolvió al proceso municipal con seguimiento. La fuente no demuestra continuidad actual ni impactos causales. Sirve para llegar a la mesa de concertación con una propuesta ya acordada entre ustedes [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables
1. **Reúnanse con su red afroperuana para acordar tres situaciones de mal trato o derivación fallida que presentarán a la municipalidad.** Los casos se registran sin datos personales y con el consentimiento de cada compañera [Ficha 5, Participación de mujeres indígenas en Cotacachi].
2. **Mapeen con el CEM qué servicio atiende cada tipo de caso y dónde se corta la derivación.** Así piden una mejora concreta y no un servicio nuevo que duplique los existentes [Ficha 8, Centro de atención a mujeres en Goiás].
3. **Propongan a la Gerencia de Desarrollo Social medidas de trato sin discriminación, codiseñadas con su red.** Incluyan una persona de seguimiento y una matriz de propuestas aceptadas, pendientes y rechazadas con sus razones. Esta es una propuesta de adaptación para Perú, no una experiencia ya ejecutada [Ficha 8, Centro de atención a mujeres en Goiás].

##### 4. Por dónde empezar
Texto para leer en la reunión:

"Formamos parte de un colectivo de jóvenes afroperuanas de Lima. Varias de nosotras fuimos mal atendidas o enviadas de un lugar a otro al buscar ayuda frente a la violencia. Traemos tres situaciones concretas y proponemos acordar con la Gerencia de Desarrollo Social una mejora de orientación y derivación, con una persona responsable de seguimiento."

Qué pedir: una reunión de trabajo con la Gerencia de Desarrollo Social y un lugar en la agenda de la mesa de concertación para presentar la propuesta.

##### 5. Próximo paso
Esta semana, convoquen a las 15 integrantes y a la red afroperuana a una reunión de una hora para elegir las tres situaciones y definir quién presenta la propuesta. Resultado esperado: un documento de una página listo para solicitar la reunión con la Gerencia.

##### 6. Referencias

**Ficha 8. Atención integral a mujeres en Goiás (Brasil)**

[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.

[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.

[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.

[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**

[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.

[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S2 · Hoja de recomendaciones

Sociedad civil · independiente · Cusco · 10 de noviembre de 2026

##### 1. Su consulta
Usted quiere que la municipalidad destine un presupuesto para jóvenes universitarios en Cusco y que la propuesta llegue al alcalde. No tiene una organización detrás ni condiciones especiales, y todavía no sabe cómo empezar.

##### 2. Buenas prácticas que aplican
**GOP + Jovem, Presupuesto Participativo Juvenil**, en Vila Nova de Gaia (Portugal): la municipalidad convoca propuestas de jóvenes de 13 a 30 años, las somete a votación y financia las ganadoras. En 2025 asignó 240 000 euros, con un máximo de 40 000 por proyecto. El Parque Multigeneracional de Serzedo, elegido en 2020, se inauguró en 2025; la fuente acredita esa obra, no el impacto de todo el programa. Sirve a su caso porque muestra una partida con reglas públicas [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

##### 3. Recomendaciones aplicables
1. **Averigüe qué mecanismo participativo ya existe en su municipalidad y quién lo maneja.** Pregunte en la oficina municipal de participación o presupuesto si hay una partida posible, pues el piloto necesita una competencia municipal y un presupuesto viable [Ficha 1, GOP + Jovem en Vila Nova de Gaia].
2. **Reúna a otros jóvenes universitarios y acuerden edades y reglas.** Como estudiantes de varias universidades no tienen las mismas facilidades, planteen apoyo para formular propuestas y que el acceso digital no decida quién participa [Ficha 1, GOP + Jovem en Vila Nova de Gaia].
3. **Lleve una ficha sencilla de propuesta.** Debe contener problema, solución, costo estimado y población beneficiaria; sirve para que el alcalde vea qué se pide concretamente [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

##### 4. Por dónde empezar
Texto para leer en una reunión con la autoridad:

"Somos jóvenes universitarios de Cusco y queremos proponer un piloto de presupuesto participativo juvenil. En Vila Nova de Gaia, Portugal, un programa similar financia proyectos elegidos por votación de jóvenes. Pedimos acordar con ustedes el alcance de un piloto, con reglas claras y apoyo para presentar propuestas."

Qué pedir en concreto: una reunión con las áreas de juventud y presupuesto para acordar el alcance de un piloto.

##### 5. Próximo paso
Esta semana, escriba a la oficina municipal de participación o juventud pidiendo una cita, y convoque a dos o tres compañeros de universidad para ir juntos. Resultado esperado: una fecha de reunión y un primer grupo que respalde la propuesta.

##### 6. Referencias

**Ficha 1. GOP + Jovem en Vila Nova de Gaia (Portugal)**

[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.

[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.

[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.

[4] Municipalidad de Gaia. Reglamentos y normas de participación.

[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S3 · Hoja de recomendaciones

Sociedad civil · Federación de comunidades campesinas · Puno · 10 de noviembre de 2026

##### 1. Su consulta
La federación agrupa 12 comunidades aimaras rurales y quiere que las mujeres lleven propuestas propias al presupuesto participativo. Las asambleas se hacen en castellano, algunas mujeres no saben leer y las distancias dificultan asistir. Las instancias a las que se dirige son la municipalidad provincial y el comité de vigilancia.

##### 2. Buenas prácticas que aplican
**Cotacachi, Ecuador.** El municipio facilitó reuniones propias de mujeres indígenas, con lengua originaria y materiales visuales y cotidianos, y devolvió sus prioridades al presupuesto participativo. Documenta la participación femenina en el seguimiento presupuestario; es un reporte de 2006, sin prueba de continuidad ni de impacto causal. Sirve porque parte de las mismas barreras de idioma y de lectura [Ficha 5, Participación de mujeres indígenas en Cotacachi].

**Ccarhuayo, Cusco.** El municipio y la UGEL acordaron con las familias un modelo educativo con quechua y saberes locales, sistematizado por el Ministerio de Cultura sin estimación causal independiente. Sirve para sostener que el conocimiento comunitario forma parte del diseño del servicio [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].

##### 3. Recomendaciones aplicables
1. **La federación acuerda con las mujeres de sus 12 comunidades una reunión preparatoria antes de la asamblea del presupuesto.** Se hace en aimara, con horario, cuidado de niños y traslado definidos por ellas, y se apoya en dibujos o ejemplos cotidianos para quienes no leen [Ficha 5, Participación de mujeres indígenas en Cotacachi].
2. **La federación lleva a la reunión previa una matriz sencilla: propuesta, respuesta municipal y seguimiento.** Se pide al comité de vigilancia que anote cada propuesta como aceptada, pendiente o rechazada, con sus razones [Ficha 5, Participación de mujeres indígenas en Cotacachi].
3. **La federación pide a la municipalidad provincial una reunión para acordar cómo recibirá las propuestas.** Incluye quién responde, si habrá intérprete aimara y cómo se reconoce el conocimiento de las mujeres, sin reducir su identidad a vestimenta o espectáculos [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].

##### 4. Por dónde empezar
Texto para leer en la reunión con la municipalidad provincial:

"Formamos parte de una federación de 12 comunidades aimaras. Las asambleas del presupuesto participativo son en castellano y muchas mujeres no pueden opinar. Proponemos una reunión previa en aimara con las mujeres y que sus propuestas queden registradas con respuesta municipal."

Qué pedir en concreto: una reunión preparatoria en aimara, con apoyos de traslado y cuidado, y un registro de propuestas con respuesta del municipio.

##### 5. Próximo paso
Esta semana, convoquen a las mujeres de dos o tres comunidades para preguntarles qué horario, lugar y apoyos necesitan. El resultado esperado es una lista de condiciones acordada con ellas para llevar a la municipalidad.

##### 6. Referencias

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**

[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.

[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

**Ficha 3. Escuelas para el Buen Vivir en Ccarhuayo (Perú)**

[1] Ministerio de Cultura (2016). Buenas Prácticas Interculturales en la Gestión Pública, experiencias 2014–2015, pp. 85–88.

[2] Ministerio de Cultura (11/12/2014). Entrega de premios de Buenas Prácticas Interculturales en Gestión Pública.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

## Anexo C. Hojas generadas en la ronda 3 (instrucciones versión 3)

#### Caso A1 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Provincial de Huamanga · Ayacucho · 10 de noviembre de 2026

##### 1. Su consulta
Usted es Subgerente de Participación Vecinal de la Municipalidad Provincial de Huamanga y quiere que jóvenes de 16 a 29 años de comunidades quechuahablantes y barrios periféricos propongan y decidan parte del presupuesto participativo 2027, cuyo proceso se realiza en marzo. Su equipo es de tres personas, sin partida propia, con la UNSCH y dos colectivos juveniles como aliados. Las convocatorias salen en castellano y por Facebook, y los proyectos aprobados en años anteriores no se ejecutaron, por lo que hay desconfianza.

##### 2. Buenas prácticas que aplican
**GOP + Jovem, Vila Nova de Gaia (Portugal).** La municipalidad convoca propuestas juveniles, las somete a votación y financia las ganadoras con una partida definida (240 000 euros y hasta 40 000 por proyecto en 2025). Una de las obras elegidas en 2020 se inauguró en 2025; esto acredita un proyecto ejecutado, no una evaluación del programa, y la fuente no explica la demora. Sirve a su caso porque ordena propuesta, votación y seguimiento público.

**Participación de mujeres indígenas en Cotacachi (Ecuador).** El municipio preparó la participación en la propia lengua, con materiales visuales y reuniones previas, y devolvió las prioridades al proceso cantonal. La fuente de 2006 documenta participación en el seguimiento del presupuesto, sin acreditar continuidad ni impacto causal. Sirve a su caso porque responde a la barrera del idioma y del acceso.

##### 3. Recomendaciones aplicables
1. **La Subgerencia de Participación Vecinal acuerda con el área de presupuesto una parte del presupuesto participativo 2027 para propuestas juveniles.** Sin una partida identificable, el compromiso no puede cumplirse, y por eso GOP + Jovem parte de reglas públicas y un monto definido [Ficha 1, GOP + Jovem en Vila Nova de Gaia].
2. **La Subgerencia y los dos colectivos juveniles preparan las propuestas antes de marzo con reuniones presenciales y facilitación en quechua.** Conviene sumar a la UNSCH para apoyar la formulación de propuestas, y combinar convocatoria urbana y comunitaria sin depender de Facebook [Ficha 1, GOP + Jovem en Vila Nova de Gaia; Ficha 5, Participación de mujeres indígenas en Cotacachi].
3. **La Subgerencia lleva una matriz pública de propuestas, respuesta municipal y avance de ejecución.** Registrar si cada propuesta fue aceptada, pendiente o rechazada y por qué, y comunicar las demoras, responde directamente a la desconfianza por proyectos no ejecutados [Ficha 1, GOP + Jovem en Vila Nova de Gaia; Ficha 5, Participación de mujeres indígenas en Cotacachi].
4. **La Subgerencia define con las organizaciones juveniles, antes de convocar, cómo se recibirán las propuestas y quién responderá por ellas.** La pertinencia étnica debe diseñarse con las propias juventudes, no solo con traducción, y requiere un responsable que conteste cada propuesta [Ficha 1, GOP + Jovem en Vila Nova de Gaia; Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar
1. Reunirse con el área de presupuesto para acordar el monto o porcentaje reservado a propuestas juveniles y las reglas de la convocatoria.
2. Reunirse con los dos colectivos juveniles y la UNSCH para acordar la ficha de propuesta (problema, solución, costo estimado, población beneficiaria), los lugares de reunión y la facilitación en quechua.
3. Reunirse con las áreas que ejecutarán obras y servicios para acordar la matriz de seguimiento y quién la publica.

##### 5. Próximo paso
Esta semana, convoque a los dos colectivos juveniles y a la UNSCH a una reunión de trabajo para acordar la fecha de reuniones preparatorias en comunidades y barrios y el formato de la ficha de propuesta. Resultado esperado: un calendario y una ficha lista para usar antes de marzo.

##### 6. Referencias
**Ficha 1. GOP + Jovem en Vila Nova de Gaia (Portugal)**
[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.
[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.
[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.
[4] Municipalidad de Gaia. Reglamentos y normas de participación.
[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A3 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Distrital de El Carmen · Ica · 10 de noviembre de 2026

##### 1. Su consulta
Como Gerente de Desarrollo Social de la Municipalidad Distrital de El Carmen, usted quiere mejorar la atención a mujeres afroperuanas que denuncian violencia. Sus prioridades son la DEMUNA y el CEM, y cuenta con personal reducido. Plantea tomar como modelo el centro de Goiás y pregunta cuánto cuesta y cuántas mujeres atendió.

##### 2. Buenas prácticas que aplican
**Centro Especializado de Atendimento à Mulher (CEAM) Brasilete Ramos Caiado**, Goiás (Brasil): servicio municipal de orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, con charlas, cursos y talleres de prevención. Recibió el Premio Construir Igualdad 2020, un reconocimiento externo; las fuentes no publican costo, personal ni número de mujeres atendidas. Sirve a su caso por su enfoque de atención integral y de acompañamiento a la usuaria [Ficha 8, Atención integral a mujeres en Goiás].

##### 3. Recomendaciones aplicables
1. **Reúna a la DEMUNA, el CEM y los servicios de salud y justicia para mapear qué oferta ya existe.** Con personal reducido, conviene cerrar barreras de acceso y continuidad entre servicios antes de abrir uno nuevo, sin duplicar lo que ya funciona [Ficha 8, Atención integral a mujeres en Goiás].
2. **Acuerde con organizaciones de mujeres afroperuanas medidas de trato sin discriminación y de acceso a la información.** Esta adaptación al enfoque afroperuano es una propuesta para el Perú, no una experiencia ejecutada en Goiás, y debe codiseñarse con las propias organizaciones [Ficha 8, Atención integral a mujeres en Goiás].
3. **Designe una persona responsable de comprobar que cada derivación se complete.** Verificar que las mujeres lleguen al servicio al que fueron enviadas, con confidencialidad y consentimiento, ayuda a evitar la revictimización [Ficha 8, Atención integral a mujeres en Goiás].

##### 4. Por dónde empezar
1. Reunirse con la DEMUNA y el CEM para listar los servicios que hoy atienden a mujeres que denuncian violencia y quién responde por cada uno.
2. Convocar a organizaciones de mujeres afroperuanas del distrito para identificar con ellas una barrera de acceso concreta.
3. Acordar con los servicios competentes del MIMP, salud y justicia una mejora puntual de orientación o derivación, con un responsable de seguimiento.

##### 5. Próximo paso
Esta semana, convoque una reunión con las responsables de la DEMUNA y del CEM para acordar qué barrera de acceso se abordará primero y quién dará seguimiento. Debe salir de la reunión con un responsable y una fecha de revisión.

##### 6. Referencias
**Ficha 8. Atención integral a mujeres en Goiás (Brasil)**
[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.
[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.
[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.
[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S1 · Hoja de recomendaciones

Sociedad civil · Colectivo de jóvenes afroperuanas (independiente) · Lima · 10 de noviembre de 2026

##### 1. Su consulta

El colectivo, de 15 integrantes y sin presupuesto, trabaja con mujeres jóvenes afroperuanas de Lima Metropolitana. Varias compañeras fueron maltratadas o enviadas de una oficina a otra en la municipalidad y en la comisaría. Quieren que la municipalidad las atienda sin discriminación y derive bien los casos de violencia. Sus temas son la lucha contra la discriminación y el enfoque de género, y llevarán su propuesta a la Gerencia de Desarrollo Social y a la mesa de concertación del distrito. Cuentan con contacto con una red afroperuana y con el CEM.

##### 2. Buenas prácticas que aplican

**Centro Especializado de Atendimento à Mulher (CEAM), Goiás, Brasil.** Servicio municipal de orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, con charlas y talleres de prevención, premiado en 2020 por el CIPDH-UNESCO. Las fuentes acreditan la oferta y el reconocimiento, pero no publican cuántas mujeres atendió ni una reducción de la violencia. Sirve a su caso porque su problema es el trato y la derivación, no la falta de servicios [Ficha 8, CEAM Goiás].

**Participación de mujeres indígenas en Cotacachi, Ecuador.** El municipio facilitó reuniones propias de mujeres y devolvió sus prioridades al proceso de decisión. Las fuentes documentan participación en el seguimiento presupuestario, no impactos causales. Sirve para que su propuesta se prepare entre ustedes y llegue ordenada a la autoridad [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables

1. **Mapeen primero a dónde van hoy los casos.** El colectivo registra, con consentimiento de cada compañera, en qué oficina se dio el mal trato o la derivación fallida y qué barrera hubo. Así la propuesta parte de casos concretos y no de impresiones [Ficha 8, CEAM Goiás].
2. **Pidan una mejora puntual de orientación y derivación.** El colectivo y la Gerencia de Desarrollo Social acuerdan cómo se orienta y deriva a las usuarias hacia el CEM y los servicios competentes, con una persona responsable de seguimiento. El objetivo es cerrar barreras de acceso sin duplicar servicios [Ficha 8, CEAM Goiás].
3. **Propongan medidas de trato sin discriminación, codiseñadas con su red.** El colectivo y la red afroperuana redactan con la municipalidad criterios de trato para el personal de atención. La Ficha 8 no acredita un programa para población afrodescendiente, por lo que esta medida es una propuesta de adaptación para Perú [Ficha 8, CEAM Goiás].
4. **Registren cada propuesta y su respuesta.** El colectivo lleva una matriz sencilla de propuestas presentadas, respuesta municipal (aceptada, pendiente o rechazada, con razones) y fecha de seguimiento, que acompañe cada reunión de la mesa de concertación [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar

Texto para leer en la reunión:

"Somos un colectivo de jóvenes afroperuanas de Lima. Varias compañeras fueron maltratadas o enviadas de una oficina a otra al buscar ayuda por violencia. Proponemos acordar con ustedes cómo se orienta y deriva a las usuarias hacia el CEM y los servicios competentes, con una persona responsable de seguimiento. También queremos trabajar juntas los criterios de trato para el personal de atención."

Qué pedir en concreto: una reunión de trabajo con la Gerencia de Desarrollo Social para acordar un paso de orientación o derivación y quién da seguimiento.

##### 5. Próximo paso

Esta semana, reúnanse las 15 integrantes y la red afroperuana para listar los casos de mal trato o derivación fallida, con consentimiento y sin datos que identifiquen a nadie. Con esa lista, pidan la cita con la Gerencia de Desarrollo Social.

##### 6. Referencias

**Ficha 8. Centro Especializado de Atendimento à Mulher, CEAM (Brasil)**
[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.
[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.
[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.
[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S3 · Hoja de recomendaciones

Sociedad civil · Federación de comunidades campesinas · Puno · 10 de noviembre de 2026

##### 1. Su consulta

Como secretaria de actas de una federación de 12 comunidades campesinas aimaras de zona rural, usted quiere que las mujeres participen en el presupuesto participativo con propuestas propias. Su prioridad es la municipalidad provincial y el comité de vigilancia. Las asambleas se hacen en castellano, las mujeres casi no hablan y algunas no saben leer. El idioma y las distancias son las barreras principales. Sus temas son participación ciudadana e interculturalidad y pertinencia territorial.

##### 2. Buenas prácticas que aplican

**Participación de mujeres indígenas en Cotacachi** (Ecuador): el municipio facilitó espacios propios de mujeres, uso de lengua originaria y materiales visuales, y las propuestas pasaron al presupuesto participativo y a su seguimiento. La publicación de 2006 documenta mujeres en el seguimiento presupuestario, pero no demuestra continuidad actual ni impacto causal. Sirve porque enfrenta las mismas barreras de lengua y lectura que usted describe [Ficha 5, Participación de mujeres indígenas en Cotacachi].

**Escuelas para el Buen Vivir en Ccarhuayo** (Cusco): el municipio acordó con la comunidad un servicio que recupera el quechua y los saberes locales, con las familias como productoras de conocimiento. Es una sistematización institucional, sin evaluación independiente. Sirve como precedente peruano de un municipio que reconoce la lengua originaria en su gestión [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].

##### 3. Recomendaciones aplicables

1. **Realicen reuniones preparatorias de mujeres en cada comunidad, en aimara y antes de la asamblea general.** La federación convoca y acuerda con las mujeres horario, lugar y cuidado de niños. Allí formulan sus propuestas sin depender de la lectura [Ficha 5, Participación de mujeres indígenas en Cotacachi].

2. **Pidan a la municipalidad provincial una matriz de propuestas, respuesta y seguimiento.** La federación presenta las propuestas de las mujeres y exige que se registren como aceptadas, pendientes o rechazadas, con sus razones. Así el comité de vigilancia puede darles seguimiento [Ficha 5, Participación de mujeres indígenas en Cotacachi].

3. **Soliciten materiales visuales y facilitación en aimara en las instancias del presupuesto participativo.** Pida que la municipalidad revise su proceso vigente y asigne personal que responda a las propuestas. Antes de fijar qué se solicita, consulten a las mujeres sobre sus necesidades concretas [Ficha 5, Participación de mujeres indígenas en Cotacachi].

4. **Propongan a la municipalidad un acuerdo escrito sobre participación y reconocimiento de lo que aportan las comunidades.** La federación define con las mujeres cómo se usarán sus saberes y quién los reconoce. Una actividad cultural aislada no sustituye su intervención en el diseño [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].

##### 4. Por dónde empezar

Texto para leer en una reunión con la municipalidad provincial o el comité de vigilancia:

"Formamos parte de una federación de 12 comunidades campesinas aimaras. Las asambleas del presupuesto participativo son en castellano y las mujeres casi no participan. Proponemos reuniones previas de mujeres en aimara, con materiales visuales, y una matriz pública que registre sus propuestas y la respuesta municipal."

Qué pedir en concreto: una reunión de coordinación con el área municipal responsable del presupuesto participativo y el comité de vigilancia para acordar la matriz y el apoyo en aimara.

##### 5. Próximo paso

Esta semana, convoque a las mujeres de dos o tres comunidades para preguntarles qué barreras enfrentan y qué propuestas llevarían. Use sus respuestas para sustentar el pedido ante la municipalidad.

##### 6. Referencias

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

**Ficha 3. Escuelas para el Buen Vivir en Ccarhuayo (Perú)**
[1] Ministerio de Cultura (2016). Buenas Prácticas Interculturales en la Gestión Pública, experiencias 2014–2015, pp. 85–88.
[2] Ministerio de Cultura (11/12/2014). Entrega de premios de Buenas Prácticas Interculturales en Gestión Pública.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

## Anexo D. Hojas generadas en la ronda 2 (instrucciones versión 2)

#### Caso A1 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Provincial de Huamanga · Ayacucho · 10 de noviembre de 2026

##### 1. Su consulta

Usted es Subgerente de Participación Vecinal de la Municipalidad Provincial de Huamanga y quiere que jóvenes de 16 a 29 años, de comunidades quechuahablantes y barrios periféricos, propongan y decidan parte del presupuesto participativo 2027, cuyo proceso se realiza en marzo de 2027. Los ejes consultados son participación juvenil e interculturalidad y pertinencia territorial. Cuenta con un equipo de tres personas, sin partida propia, y con dos aliados: la UNSCH y dos colectivos juveniles. Hoy las convocatorias salen en castellano y por Facebook. Además, proyectos aprobados en años anteriores no se ejecutaron y la gente desconfía.

##### 2. Buenas prácticas que aplican

**GOP + Jovem, Presupuesto Participativo Juvenil de Vila Nova de Gaia** (Portugal). La municipalidad convoca propuestas juveniles, las somete a votación y financia a los ganadores con un presupuesto definido. En la edición 2025 asignó 240 000 euros, con un máximo de 40 000 por proyecto. Su obra más visible es el Parque Multigeneracional de Serzedo, ganador en 2020 e inaugurado en 2025. La fuente acredita esa obra, no una evaluación de todo el programa. Sirve a su caso porque pone reglas públicas y una partida identificable para lo que la juventud puede decidir. Se aleja de Huamanga en que su partida ya existía y en que no describe cómo llegó a población quechuahablante [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

**Participación de mujeres indígenas en Cotacachi** (Ecuador). El municipio preparó la participación de mujeres indígenas antes de la reunión general del presupuesto participativo, con lengua originaria, materiales visuales y reuniones propias, y devolvió sus prioridades al proceso cantonal. Los resultados datan de 2006 y la fuente no prueba continuidad actual ni impactos causales. Sirve porque su problema es el mismo: barreras de lengua y confianza que impiden proponer en la reunión general. Se aleja en que el caso trabajó con mujeres, no con jóvenes [Ficha 5, Participación de mujeres indígenas en Cotacachi].

**Construcción participativa de las escuelas para el buen vivir en Ccarhuayo** (Perú, Cusco). El municipio y la UGEL construyeron con la comunidad un modelo escolar con quechua, saberes locales y participación de las familias. El Ministerio de Cultura lo sistematizó en 2016. La fuente no acredita su funcionamiento actual ni mide causalidad. Sirve como antecedente andino de trabajo en quechua con acuerdos entre municipio y comunidad. Se aleja en que atendió a niñez de escuelas rurales, no a jóvenes ni a presupuesto [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].

##### 3. Recomendaciones aplicables

1. **Piloten una convocatoria juvenil dentro del presupuesto participativo 2027, con alcance acordado de antemano.** Su subgerencia, con las áreas de presupuesto y juventud, define la edad (16 a 29 años), qué puede decidir la juventud y cuál es el monto viable, aunque sea pequeño. Para ello debe identificar la competencia municipal y una partida realista, dado que su equipo no tiene recursos propios [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

2. **Combinen convocatoria urbana y comunitaria, y presenten las ideas en persona.** Los colectivos juveniles y la UNSCH pueden ayudar a llegar a las comunidades y barrios periféricos, con facilitación en quechua donde corresponda. Facebook queda como un canal más, de modo que el acceso digital no decida quién participa [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

3. **Realicen una reunión preparatoria con jóvenes quechuahablantes antes de la asamblea general.** Allí formulan sus propuestas con materiales visuales y en su lengua. Después se incorporan al proceso con una matriz de propuestas, respuesta municipal y seguimiento, que registre las aceptadas, las pendientes y las rechazadas con sus razones. Conviene acordar con los participantes horarios, desplazamiento y cuidado [Ficha 5, Participación de mujeres indígenas en Cotacachi].

4. **Repartan las responsabilidades por escrito entre municipalidad, colectivos juveniles y UNSCH.** El acuerdo debe reconocer a quienes conocen el territorio como parte del diseño, no solo como asistentes. Prevean tiempos de concertación para que la consulta no se reduzca a un evento cultural aislado. La lengua y el conocimiento local se acuerdan con las propias comunidades [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].

5. **Publiquen hitos de ejecución y comuniquen las demoras.** Gaia tardó cinco años entre la selección de Serzedo y su inauguración, y la fuente no explica las causas. Por eso la lección es hacer visible cada etapa de cada proyecto aprobado. Para Huamanga, donde proyectos anteriores no se ejecutaron, esta es la condición para recuperar la confianza [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

##### 4. Por dónde empezar

1. Reúnan al área de presupuesto, al área de juventud, a la UNSCH y a los dos colectivos juveniles. Acuerden el alcance del piloto para 2027 y elaboren una ficha sencilla de propuesta, con problema, solución, costo estimado y población beneficiaria [Ficha 1, GOP + Jovem en Vila Nova de Gaia].
2. Consulten con jóvenes de comunidades quechuahablantes y de barrios periféricos qué barreras enfrentan para participar (lengua, horarios, transporte, desconfianza). Con esa información, definan en conjunto el formato de la reunión preparatoria [Ficha 5, Participación de mujeres indígenas en Cotacachi].
3. Convoquen en persona y en quechua con los colectivos y la UNSCH, y usen Facebook como complemento. Asignen a una persona de su equipo la tarea de responder a las propuestas y mantener la matriz de seguimiento [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 5. Próximo paso

Esta semana, convoque una primera reunión con la UNSCH y los dos colectivos juveniles para acordar la edad, el monto viable del piloto y quién preparará la ficha de propuesta. El resultado esperado es un alcance acordado por escrito antes de abrir la convocatoria.

##### 6. Referencias

**Ficha 1. GOP + Jovem en Vila Nova de Gaia (Portugal)**
Instrumentos: presupuesto participativo juvenil, reglamento y normas de participación; plataforma municipal de propuestas y votación.
Fuentes de verificación:
[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.
[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.
[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.
[4] Municipalidad de Gaia. Reglamentos y normas de participación.
[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
Instrumentos: presupuesto participativo, talleres y comités de seguimiento.
Fuentes de verificación:
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

**Ficha 3. Escuelas para el Buen Vivir en Ccarhuayo (Perú)**
Instrumentos: convenio municipal con la UGEL; enfoque de educación intercultural bilingüe; cuadernos de sabiduría elaborados con las familias.
Fuentes de verificación:
[1] Ministerio de Cultura (2016). Buenas Prácticas Interculturales en la Gestión Pública, experiencias 2014–2015, pp. 85–88.
[2] Ministerio de Cultura (11/12/2014). Entrega de premios de Buenas Prácticas Interculturales en Gestión Pública.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A2 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Distrital de El Agustino · Lima · 10 de noviembre de 2026

##### 1. Su consulta

Como regidor de El Agustino, usted busca reactivar las juntas vecinales y lograr que la municipalidad responda a sus pedidos. Trabaja con juntas vecinales y organizaciones afroperuanas del distrito. Sus temas son fortalecimiento democrático y participación ciudadana, y sus prioridades son la seguridad y la limpieza de espacios públicos. No cuenta con presupuesto adicional. Sí tiene un área de participación vecinal con dos personas.

##### 2. Buenas prácticas que aplican

**Construyendo Ciudadanía (San Luis Potosí, México).** El ayuntamiento organizó representación por demarcaciones y eligió juntas ciudadanas que dialogan con el gobierno local. El jurado del OIDP confirmó la constitución de 284 juntas. La candidatura reporta más de 35 000 votantes en 2022 y 390 espacios públicos rehabilitados; son cifras declaradas por la postulación, sin evaluación independiente. Sirve a su caso porque parte de juntas territoriales y de su vínculo con servicios concretos, aunque la ficha pide revisar la participación efectiva y no solo el número de juntas [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].

**Participación de mujeres indígenas en Cotacachi (Ecuador).** El municipio facilitó reuniones propias de mujeres indígenas, con lengua originaria y materiales visuales, y vinculó sus propuestas con el presupuesto participativo y su seguimiento. El reporte de 2006 no demuestra continuidad actual ni impactos causales. Aporta un método para que las organizaciones afroperuanas preparen sus propuestas antes de la reunión general. Es un caso de mujeres indígenas, así que su uso con población afroperuana es una adaptación [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables

1. **Parta de las juntas vecinales que ya existen.** Que el área de participación vecinal elabore un registro de las juntas del distrito: cuáles están activas, cuáles inactivas y quiénes las representan. La ficha advierte que crear más espacios debe justificarse frente a la posibilidad de mejorar los actuales, algo que pesa en su caso por no tener presupuesto adicional [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].

2. **Defina las funciones de cada junta y quién responde a sus solicitudes.** Acuerde por escrito qué puede pedir cada junta y qué área municipal responde. La experiencia de San Luis Potosí muestra que las juntas son útiles cuando hay personal responsable de tramitar sus solicitudes y cuando se devuelven respuestas, de modo que las reuniones no queden en recoger pedidos [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].

3. **Lleve a las juntas una reunión periódica con el área competente en seguridad y limpieza.** Para sus dos prioridades, convoque a las juntas y a los responsables de seguridad ciudadana y de limpieza pública, y deje un registro público de solicitudes, responsables y fechas de respuesta. Elija primero un problema concreto que el distrito pueda atender con sus recursos actuales [Ficha 7, Construyendo Ciudadanía en San Luis Potosí].

4. **Prepare con las organizaciones afroperuanas sus propuestas antes de la reunión general.** Reúnase aparte con ellas para definir qué piden en seguridad y limpieza, y llévelas luego a la reunión con las juntas. En Cotacachi, esa preparación previa mejoró las condiciones para formular propuestas propias. Las barreras de horario, cuidado y desplazamiento las identifican las propias participantes [Ficha 5, Participación de mujeres indígenas en Cotacachi].

5. **Registre cada propuesta y su respuesta.** Con una matriz sencilla de propuestas, respuesta municipal y seguimiento, anote si cada pedido fue aceptado, queda pendiente o fue rechazado, y las razones. Así las organizaciones saben qué pasó con lo que plantearon [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar

1. Reúnase con las dos personas del área de participación vecinal para acordar quién arma el registro de juntas y en qué plazo.
2. Convoque a las juntas activas y a las organizaciones afroperuanas, con apoyo de la gerencia que corresponda, para elegir una primera prioridad entre seguridad y limpieza.
3. Siéntese con los responsables municipales de seguridad ciudadana y de limpieza pública para acordar quién responde y en cuántos días.
4. Abra la matriz de propuestas y respuestas, y presente su estado en la siguiente reunión con las juntas.

##### 5. Próximo paso

Esta semana, converse con el responsable del área de participación vecinal para acordar el registro de juntas y fijar la fecha de la primera reunión. Resultado esperado: una lista inicial de juntas y una convocatoria con fecha.

##### 6. Referencias

**Ficha 7. Construyendo Ciudadanía en San Luis Potosí (México)**
Instrumentos: Ley estatal de Juntas de Participación Ciudadana; planes municipales de desarrollo; juntas, consejo y matriz de indicadores. Referencia: ficha completa de candidatura, con método e indicadores [2]; comunicación del jurado OIDP [1].
[1] OIDP (2025). San Luis Potosí gana la 19.ª Distinción por Construyendo Ciudadanía.
[2] Ayuntamiento de San Luis Potosí (2025). Candidatura Construyendo Ciudadanía ante el OIDP.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
Instrumentos: Presupuesto participativo, talleres y comités de seguimiento. Referencia: publicación OIDP sobre Cotacachi, especialmente las secciones de actores, metodología, resultados y conclusiones [1].
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A3 · Hoja de recomendaciones

Autoridades y funcionarios municipales · Municipalidad Distrital de El Carmen · Ica · 10 de noviembre de 2026

##### 1. Su consulta

Como Gerente de Desarrollo Social de la Municipalidad Distrital de El Carmen, usted consulta sobre lucha contra la discriminación. Quiere mejorar la atención a las mujeres afroperuanas que denuncian violencia, con prioridad en la DEMUNA y el CEM. Cuenta con personal reducido. Plantea que desea un centro como el de Goiás y pregunta cuánto cuesta y cuántas mujeres atendió.

##### 2. Buenas prácticas que aplican

**Centro Especializado de Atendimento à Mulher (CEAM) Brasilete Ramos Caiado, Goiás (Brasil).** El gobierno municipal ofrece orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, además de charlas, cursos y talleres de prevención. Fue reconocido en el Premio Construir Igualdad 2020 por el CIPDH-UNESCO. Sobre su pregunta: las fuentes no desagregan presupuesto ni personal, y no publican una cifra comparable de usuarias atendidas ni una reducción atribuible de la violencia. La documentación consultada tampoco acredita que siga operando en 2026. Sirve a su caso por su modelo de atención y acompañamiento, pero no hay datos de costo con los que dimensionar un centro propio [Ficha 8, Atención integral a mujeres en Goiás].

**Procesos de inclusión de mujeres indígenas en la gestión local, Cotacachi (Ecuador).** El municipio facilitó espacios propios de mujeres, priorización de propuestas y seguimiento del presupuesto, con reuniones autónomas y devolución de prioridades al proceso cantonal. Se aleja de su caso en que trabajó con mujeres indígenas y en participación presupuestaria, no en atención a víctimas de violencia. Aporta un método para escuchar a las mujeres antes de decidir [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables

1. **Mapeen primero lo que ya existe.** El área de Desarrollo Social, con la DEMUNA y el CEM, debe listar qué servicios hay, quién responde por cada uno y dónde se interrumpe el camino de una mujer que denuncia. Con personal reducido, la adaptación apunta a cerrar barreras de acceso y continuidad, y no a duplicar servicios [Ficha 8, Atención integral a mujeres en Goiás].

2. **Mejoren la articulación en lugar de crear un centro.** La ficha propone mejorar la coordinación municipal con los servicios especializados existentes. Coordinen con los servicios competentes del MIMP, salud y justicia, y verifiquen que cada derivación se complete y que el trato sea respetuoso, algo que requiere seguimiento [Ficha 8, Atención integral a mujeres en Goiás].

3. **Codiseñen con organizaciones de mujeres afroperuanas.** El trato sin discriminación y el acceso lingüístico deben acordarse con ellas, no definirse desde el escritorio. Este enfoque étnico es una propuesta de adaptación de los autores de la Caja de Herramientas para Perú, no una experiencia ya ejecutada en Goiás, cuyas fuentes no acreditan un programa específico para comunidades quilombolas [Ficha 8, Atención integral a mujeres en Goiás].

4. **Resguarden confidencialidad y consentimiento.** Antes de coordinar entre áreas, acuerden cómo se protege la información de cada mujer y cuándo se necesita su consentimiento para derivar su caso [Ficha 8, Atención integral a mujeres en Goiás].

5. **Escuchen antes de decidir.** Una reunión preparatoria con organizaciones de mujeres, con horario, cuidado y desplazamiento acordados con ellas, puede mejorar las condiciones para que formulen propuestas propias. Convocar por sí solo no demuestra incidencia, por lo que conviene registrar cuáles propuestas se aceptan, cuáles quedan pendientes y cuáles se rechazan, con sus razones [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar

1. Reúnan a los responsables municipales, a los servicios especializados y a organizaciones de mujeres afroperuanas para identificar una barrera de acceso concreta, por ejemplo la orientación inicial o la derivación entre la DEMUNA y el CEM [Ficha 8, Atención integral a mujeres en Goiás].
2. Acuerden una mejora puntual de orientación o derivación y nombren a una persona responsable de su seguimiento [Ficha 8, Atención integral a mujeres en Goiás].
3. Abran una matriz sencilla de propuestas, respuesta municipal y seguimiento, para registrar lo que planteen las mujeres [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 5. Próximo paso

Esta semana, convoque a la DEMUNA y al CEM a una reunión para listar los pasos que hoy sigue una mujer que denuncia y marcar dónde se pierde el seguimiento. Resultado esperado: una barrera identificada y una persona responsable de revisarla.

##### 6. Referencias

**Ficha 8. Atención integral a mujeres en Goiás (Brasil)**
Instrumentos: servicio municipal especializado y actividades de prevención mediante charlas, cursos y talleres. Referencia: ficha CNM Centro Especializado de Atendimento à Mulher, colección MuniCiência, 2021 [3]; descripción CIPDH del centro y del premio [2]; nota informativa de UNESCO de premiación [1].
Fuentes de verificación:
[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.
[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.
[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.
[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
Instrumentos: presupuesto participativo, talleres y comités de seguimiento. Referencia: publicación OIDP sobre Cotacachi, especialmente las secciones de actores, metodología, resultados y conclusiones [1].
Fuentes de verificación:
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S1 · Hoja de recomendaciones

Sociedad civil · Colectivo de jóvenes afroperuanas (independiente) · Lima · 10 de noviembre de 2026

##### 1. Su consulta

El Colectivo de jóvenes afroperuanas, que reúne a 15 integrantes y no tiene presupuesto, quiere que la municipalidad atienda sin discriminación a mujeres jóvenes afroperuanas de Lima Metropolitana y que derive bien los casos de violencia. Varias compañeras recibieron mal trato o fueron enviadas de un lado a otro, en la municipalidad y en la comisaría. Los temas son lucha contra la discriminación y enfoque de género. Las instancias a las que quieren llegar son la Gerencia de Desarrollo Social y la mesa de concertación del distrito. Cuentan con contacto con una red afroperuana y con el CEM, y quieren llevar una propuesta concreta.

##### 2. Buenas prácticas que aplican

**Centro Especializado de Atendimento à Mulher (CEAM) Brasilete Ramos Caiado.** Es un servicio del gobierno municipal de la ciudad de Goiás, en Brasil, que ofrece orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, además de charlas, cursos y talleres de prevención. Recibió el Premio Construir Igualdad 2020 en la categoría de áreas urbanas de hasta un millón de habitantes. Las fuentes acreditan el reconocimiento y la oferta de servicios, pero no publican cuántas usuarias atendió ni una reducción de la violencia atribuible al centro. Sirve a su caso porque trata la acogida y la derivación como parte de un mismo servicio; se aleja en que las fuentes no acreditan atención específica a población afrodescendiente [Ficha 8, Centro de Atención a la Mujer de Goiás].

**Procesos y mecanismos de inclusión de las mujeres indígenas en Cotacachi.** El municipio de Cotacachi, en Ecuador, preparó la participación de mujeres indígenas en el presupuesto participativo con reuniones propias, materiales visuales y devolución de sus prioridades al proceso cantonal. La fuente es una sistematización de 2006 y no demuestra continuidad actual ni impactos causales. Sirve porque propone registrar qué propuestas se aceptan, cuáles quedan pendientes y cuáles se rechazan, con sus razones; se aleja en que trata de mujeres indígenas y de un proceso de presupuesto, no de atención de casos [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 3. Recomendaciones aplicables

1. **Pedir a la Gerencia de Desarrollo Social un mapa de derivación de casos de violencia.** Debe indicar qué servicio atiende cada situación (CEM, salud, justicia, comisaría), quién deriva y quién da seguimiento. El objetivo es cerrar barreras de acceso y evitar duplicar servicios [Ficha 8, Centro de Atención a la Mujer de Goiás].

2. **Proponer medidas concretas de trato sin discriminación, que el colectivo codiseñe con la red afroperuana.** Pueden ser una pauta de atención respetuosa para el personal de recepción y un canal para reportar el mal trato. Este enfoque étnico es una propuesta de adaptación de los autores de la Caja de Herramientas para Perú, no una práctica ya ejecutada en Goiás [Ficha 8, Centro de Atención a la Mujer de Goiás].

3. **Exigir confidencialidad y consentimiento de la usuaria en cada derivación.** Conviene verificar con las compañeras si las derivaciones se completan, porque prevenir la revictimización exige comprobarlo [Ficha 8, Centro de Atención a la Mujer de Goiás].

4. **Llevar a la mesa de concertación un registro de propuestas.** La mesa registraría cada propuesta del colectivo con su estado (aceptada, pendiente o rechazada) y la razón de la respuesta del distrito [Ficha 5, Participación de mujeres indígenas en Cotacachi].

5. **Reunirse antes con las compañeras y con la red afroperuana para acordar las prioridades.** Cotacachi muestra que preparar la participación antes de la reunión general mejora las condiciones para que las mujeres formulen propuestas propias. Las condiciones de horario, cuidado y desplazamiento se acuerdan con las participantes [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar

Para sociedad civil, la propuesta que puede leer ante la Gerencia de Desarrollo Social y en la mesa de concertación:

"Somos un colectivo de 15 jóvenes afroperuanas de Lima. Varias de nuestras compañeras fueron mal atendidas o enviadas de un lugar a otro cuando buscaron ayuda por violencia. Proponemos tres cosas: que la municipalidad elabore, con el CEM y los servicios de salud y justicia, un mapa de derivación que indique quién atiende cada caso y quién da seguimiento; que se acuerde con nosotras una pauta de atención sin discriminación para el personal; y que la mesa de concertación lleve un registro de propuestas con su respuesta. Estamos dispuestas a trabajar este diseño con ustedes."

Qué pedir en concreto:
- Una reunión con la Gerencia de Desarrollo Social para presentar la propuesta.
- Un responsable municipal del seguimiento de las derivaciones.
- Un punto en la agenda de la mesa de concertación para presentar el registro de propuestas.

##### 5. Próximo paso

Esta semana, convoquen a las 15 integrantes y a su contacto de la red afroperuana a una reunión. En ella eligen las dos situaciones de mal trato o derivación fallida que cada una acepte presentar sin exponerse, y acuerdan quién pide la cita a la Gerencia de Desarrollo Social. Resultado esperado: la solicitud de reunión enviada.

##### 6. Referencias

**Ficha 8. Atención integral a mujeres en Goiás (Brasil)**
Instrumentos: servicio municipal especializado y actividades de prevención mediante charlas, cursos y talleres.
[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.
[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.
[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.
[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
Instrumentos: presupuesto participativo, talleres y comités de seguimiento.
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S2 · Hoja de recomendaciones

Sociedad civil · Independiente · Cusco · 10 de noviembre de 2026

##### 1. Su consulta

Usted consulta sobre participación juvenil. Quiere que la municipalidad destine un presupuesto para jóvenes universitarios y su prioridad es llegar al alcalde. Actúa de manera independiente, no indicó condiciones particulares y señala que no sabe bien cómo empezar. Esta hoja le propone un camino corto: qué experiencia citar, qué pedir y cómo organizarse para presentarse ante la autoridad.

##### 2. Buenas prácticas que aplican

**GOP + Jovem, Presupuesto Participativo Juvenil de Vila Nova de Gaia** (Portugal). La Câmara Municipal de Vila Nova de Gaia convoca propuestas de jóvenes de 13 a 30 años, las somete a votación y financia las ganadoras con una partida definida. En la edición 2025 asignó 240 000 euros, con un máximo de 40 000 por proyecto; es la asignación de esa edición, no un costo de réplica en Perú. Un proyecto ganador de 2020, el Parque Multigeneracional de Serzedo, fue inaugurado en febrero de 2025. La fuente acredita esa obra terminada, no el impacto de todo el programa, y no explica por qué pasaron cinco años entre la selección y la inauguración. Sirve a su caso porque muestra cómo se ve un presupuesto para jóvenes con reglas públicas. Se aleja en que parte de un mecanismo participativo municipal ya existente, algo que usted debe averiguar en Cusco.

##### 3. Recomendaciones aplicables

1. **Averigüe qué mecanismo participativo y qué partida existen hoy en su municipalidad.** Usted puede pedir por escrito a la municipalidad información sobre su presupuesto participativo y sobre las áreas que atienden juventud. La experiencia de Gaia parte de identificar el mecanismo existente, la competencia municipal y una partida viable [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

2. **Reúna a otros jóvenes universitarios antes de presentarse al alcalde.** Usted puede convocar a estudiantes de distintas universidades de Cusco para acordar edades, tipo de propuestas y reglas básicas. Una propuesta con respaldo colectivo es más difícil de ignorar que una petición individual. La ficha pide acordar edades y reglas antes de iniciar un piloto [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

3. **Pida un piloto con alcance acotado, no un presupuesto grande.** Plantee una convocatoria pequeña, con una partida identificable y reglas públicas, para que el alcalde pueda explicar qué pueden decidir los jóvenes. En Gaia, esa claridad es lo que permite que la juventud entienda qué puede decidir [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

4. **Proponga que la participación no dependa solo de lo digital.** Pida que quienes formulen propuestas reciban apoyo y que el acceso a internet no decida quién participa. En Cusco conviene combinar convocatoria urbana y comunitaria, con facilitación en quechua cuando corresponda y presentación presencial de ideas. Si el piloto busca llegar a juventudes indígenas, el diseño debe hacerse con ellas, no por ellas [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

5. **Pida que se publiquen hitos de ejecución y se comuniquen las demoras.** Gaia muestra que puede haber distancia entre elegir un proyecto y entregarlo; la forma de cuidar la confianza es informar el avance [Ficha 1, GOP + Jovem en Vila Nova de Gaia].

##### 4. Por dónde empezar

Para presentarse ante el alcalde, puede leer esto en una reunión o dejarlo por escrito:

"Somos jóvenes universitarios de Cusco y queremos que la municipalidad destine una partida pequeña para proyectos propuestos por jóvenes. En Vila Nova de Gaia, Portugal, la municipalidad convoca propuestas juveniles, las pone a votación y financia las ganadoras con reglas públicas. Proponemos un piloto en Cusco con un monto acotado y apoyo para formular propuestas. Pedimos una reunión con el área de juventud y el área de presupuesto para acordar el alcance."

Qué pedir en concreto: una reunión con el alcalde o con el área de juventud y la de presupuesto; información sobre el mecanismo participativo y la partida disponible; y el compromiso de definir en conjunto el alcance de un piloto, con una ficha sencilla de propuesta que incluya problema, solución, costo estimado y población beneficiaria.

##### 5. Próximo paso

Esta semana, escriba una carta breve a la municipalidad pidiendo información sobre su presupuesto participativo y sobre el área que atiende a juventudes, y envíela junto con una invitación a dos o tres compañeros universitarios para firmarla en conjunto. El resultado esperado es tener una respuesta escrita y un primer grupo de jóvenes comprometido.

##### 6. Referencias

**Ficha 1. GOP + Jovem en Vila Nova de Gaia (Portugal)**
Instrumentos: Presupuesto participativo juvenil, reglamento y normas de participación; plataforma municipal de propuestas y votación. Referencia: reglamento y normas de participación del portal GOP + Jovem [4]; recuadro 3.5 de la publicación de la OCDE [1]; noticia municipal de ejecución de Serzedo [3].
Fuentes de verificación:
[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.
[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.
[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.
[4] Municipalidad de Gaia. Reglamentos y normas de participación.
[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S3 · Hoja de recomendaciones

Sociedad civil · Federación de comunidades campesinas · Puno · 10 de noviembre de 2026

##### 1. Su consulta

La Federación agrupa a 12 comunidades campesinas aimaras de la zona rural de Puno. Quiere que las mujeres de esas comunidades participen en el presupuesto participativo con propuestas propias. Los temas marcados son participación ciudadana e interculturalidad y pertinencia territorial. Las instancias prioritarias son la municipalidad provincial y el comité de vigilancia. Las barreras que usted describe son el idioma y las distancias: las asambleas se realizan en castellano, las mujeres casi no hablan en ellas y algunas no saben leer.

##### 2. Buenas prácticas que aplican

**Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local (Cotacachi, Ecuador).** El municipio facilitó espacios propios de mujeres, priorización de propuestas y participación en el seguimiento del presupuesto. Usó la lengua originaria, materiales visuales y cotidianos, y devolvió las prioridades al proceso cantonal. La publicación de 2006 documenta la participación femenina en el seguimiento presupuestario, pero no demuestra continuidad actual ni impactos causales. Responde a su caso porque enfrentó las mismas barreras de género, lengua y alfabetización. [Ficha 5, Participación de mujeres indígenas en Cotacachi].

**GANA Municipales (Nariño, Colombia).** La Gobernación llevó su equipo al territorio y sometió los proyectos a votación, con una plataforma que funciona sin internet. Las cifras de participación son reportes de la propia entidad postulante. Sirve a su caso en la forma de trabajar con distancias y poca conectividad. Se aleja en que es una iniciativa departamental con recursos de regalías, que no se trasladan a una municipalidad peruana. [Ficha 2, GANA Municipales en Nariño].

##### 3. Recomendaciones aplicables

1. **Prepare las propuestas de las mujeres antes de la asamblea del municipio.** Las mujeres de cada comunidad pueden reunirse aparte, en aimara, para formular sus propuestas, y luego llevarlas al proceso del presupuesto participativo. En Cotacachi, los espacios propios de mujeres y la priorización previa de propuestas fueron la base de su participación posterior. [Ficha 5, Participación de mujeres indígenas en Cotacachi].

2. **Acuerde con las propias mujeres las condiciones de participación.** Consulte horarios, cuidado de hijos, desplazamiento y uso del aimara. La ficha advierte que convocar a las mujeres no demuestra por sí solo que sus propuestas tengan incidencia. [Ficha 5, Participación de mujeres indígenas en Cotacachi].

3. **Use materiales visuales y cotidianos en lugar de documentos escritos.** Dibujos, mapas de la comunidad y ejemplos del trabajo diario permiten que participen las mujeres que no leen. Es el recurso que usó Cotacachi con mujeres con limitaciones de alfabetización. [Ficha 5, Participación de mujeres indígenas en Cotacachi].

4. **Pida a la municipalidad provincial jornadas descentralizadas con propuestas explicadas en lenguaje sencillo.** Nariño llevó al equipo técnico al territorio y presentó proyectos definidos antes de la votación, lo que redujo barreras operativas. Antes de pedirlo, conviene que la Federación averigüe sobre qué recursos puede decidir la municipalidad y qué criterios públicos usa para declarar viable un proyecto. [Ficha 2, GANA Municipales en Nariño].

5. **Pida al comité de vigilancia un registro de las propuestas de las mujeres.** Una matriz sencilla con propuestas presentadas, aceptadas, pendientes o rechazadas, y las razones, permite dar seguimiento a lo que ocurre con ellas. [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar

Texto que puede leer ante la municipalidad provincial o el comité de vigilancia:

"Somos la Federación de comunidades campesinas, con 12 comunidades aimaras. Las asambleas del presupuesto participativo se hacen en castellano y las mujeres de nuestras comunidades casi no pueden participar. Pedimos reunirnos con el área responsable para acordar tres cosas: una reunión preparatoria de mujeres en aimara antes de la asamblea, jornadas en las comunidades con materiales fáciles de entender, y un registro público de las propuestas de las mujeres con la respuesta de la municipalidad a cada una."

Qué pedir en concreto: una fecha para la reunión preparatoria, una persona del municipio responsable de recibir las propuestas, y que el comité de vigilancia lleve el registro de sus respuestas.

##### 5. Próximo paso

Esta semana, la Federación puede convocar a las mujeres de dos o tres comunidades a una reunión en aimara para identificar cuáles son sus propuestas prioritarias. El resultado esperado es una lista corta de propuestas que ellas mismas hayan formulado, para llevarla a la municipalidad.

##### 6. Referencias

**Ficha 5. Participación de mujeres indígenas en Cotacachi (Ecuador)**
Instrumentos: presupuesto participativo, talleres y comités de seguimiento.
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

**Ficha 2. GANA Municipales en Nariño (Colombia)**
Instrumentos: plan departamental de desarrollo, proyectos tipo, jornadas de votación y plataforma de decisión.
[1] Gobernación de Nariño (2019). Candidatura GANA Municipales ante el OIDP.
[2] OIDP (2019). Nariño gana la 13.ª Distinción a la Buena Práctica en Participación Ciudadana.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

## Anexo E. Hojas generadas en la ronda 1 (instrucciones versión 1)

#### Caso A1 · Hoja de recomendaciones

Perfil: Autoridades y funcionarios municipales. Municipalidad Provincial de Huamanga, Subgerencia de Participación Vecinal (Ayacucho). Fecha: 10 de noviembre de 2026.

##### 1. Su consulta

Usted es Subgerente de Participación Vecinal de la Municipalidad Provincial de Huamanga. Quiere que jóvenes de 16 a 29 años, de comunidades quechuahablantes y de barrios periféricos, propongan y decidan parte del presupuesto participativo 2027. El proceso formal es en marzo de 2027. Su equipo es de tres personas, no tiene partida propia y cuenta como aliados con la UNSCH y dos colectivos juveniles. Las convocatorias salen hoy en castellano y por Facebook. Proyectos aprobados en años anteriores no se ejecutaron y hay desconfianza. Sus ejes son participación juvenil e interculturalidad y pertinencia territorial.

##### 2. Buenas prácticas que aplican

**GOP + Jovem, Vila Nova de Gaia (Portugal)** [Ficha 1, GOP + Jovem]. La municipalidad convoca propuestas de jóvenes de 13 a 30 años, las somete a votación y financia las ganadoras con una partida definida. En 2025 fueron 240 000 euros, con un máximo de 40 000 por proyecto (asignación de esa edición, no un costo de réplica en Perú). Recibió el Innovation in Politics Awards 2025 y está documentado por la OCDE. Su resultado visible es el Parque Multigeneracional de Serzedo, ganador de la edición 2020 e inaugurado el 19 de febrero de 2025. La nota municipal acredita esa obra, no una evaluación del programa completo. Entre la selección y la inauguración pasaron cinco años y la fuente no explica las causas. Esa demora es relevante para su caso, donde la desconfianza viene de proyectos no ejecutados.

**Escuelas para el Buen Vivir, Ccarhuayo (Cusco)** [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo]. La Municipalidad Distrital de Ccarhuayo y la UGEL de Quispicanchi construyeron con las comunidades un modelo escolar que usa el quechua, los saberes locales y la participación de las familias. Ganó el concurso de Buenas Prácticas Interculturales del Ministerio de Cultura en 2014. Atendía a 350 niñas y niños, no a jóvenes, y la evidencia es una sistematización institucional sin medición causal independiente. Sirve a su caso en el método: acordar con las comunidades quién participa y cómo se reconoce su conocimiento.

**Presupuesto participativo de Cotacachi (Ecuador)** [Ficha 5, Participación de mujeres indígenas en Cotacachi]. El municipio facilitó reuniones preparatorias propias de mujeres indígenas, en lengua originaria y con materiales visuales, antes de la asamblea general, y devolvió sus prioridades al proceso cantonal. La publicación de 2006 documenta mayor participación femenina en el seguimiento del presupuesto, pero no prueba continuidad actual ni impacto causal. Es una práctica sobre mujeres, no sobre jóvenes. Su aporte es el método de preparar a un grupo antes de la instancia formal.

Ninguna ficha reúne su caso completo. GOP + Jovem aporta el mecanismo juvenil y las otras dos aportan la pertinencia cultural y lingüística.

##### 3. Recomendaciones aplicables

1. **Defina con precisión qué pueden decidir los jóvenes.** Gaia funciona porque hay una partida identificable y reglas públicas que explican qué decide la juventud [Ficha 1, GOP + Jovem]. Usted no tiene partida propia: acuerde con las áreas de presupuesto y planeamiento si, dentro del presupuesto participativo 2027, puede reservarse una parte para propuestas juveniles, o al menos un espacio de priorización con compromiso de respuesta. Si no se logra, dígalo a los jóvenes antes de convocarlos.

2. **Convoque en quechua y por medios presenciales.** Cotacachi usó lengua originaria y materiales visuales y cotidianos [Ficha 5, Participación de mujeres indígenas en Cotacachi]. Prepare la convocatoria en quechua y castellano, con afiches y mensajes de voz además de Facebook, y reparta la difusión en comunidades y barrios con ayuda de los colectivos juveniles. Gaia advierte además que el acceso digital no debe decidir quién participa [Ficha 1, GOP + Jovem].

3. **Codiseñe el piloto con jóvenes quechuahablantes y las comunidades.** Ccarhuayo se construyó con el acuerdo entre municipio, comunidad y entidad educativa, y reconoció a las familias como productoras de conocimiento [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo]. Siéntese con los dos colectivos y con jóvenes de comunidades antes de fijar edades, reglas y formato, y no asuma que el diseño es el mismo para zona urbana y comunitaria.

4. **Realice reuniones preparatorias antes de la asamblea de marzo.** En Cotacachi, preparar la participación antes de la reunión general mejoró las condiciones para que el grupo formulara propuestas propias, y esas propuestas se conectaron con recursos y seguimiento [Ficha 5, Participación de mujeres indígenas en Cotacachi]. Programe reuniones previas con jóvenes en comunidades y barrios periféricos, con apoyo para formular propuestas, y acuerde horarios y desplazamientos con las y los participantes.

5. **Publique los hitos de ejecución y comunique las demoras.** Es el aprendizaje de Gaia, donde cinco años separaron la selección de la obra [Ficha 1, GOP + Jovem]. Dado que en Huamanga hubo proyectos aprobados sin ejecutar, publique el estado de los proyectos pendientes de años anteriores y lleve un registro de las propuestas aceptadas, pendientes o rechazadas con sus razones, como propone la adaptación de Cotacachi [Ficha 5, Participación de mujeres indígenas en Cotacachi].

6. **Use a la UNSCH y a los colectivos para tareas definidas.** Con tres personas en el equipo, reparta funciones concretas: la UNSCH en facilitación y sistematización de propuestas, los colectivos en convocatoria y acompañamiento. Las fichas no documentan un reparto de este tipo, de modo que acuérdelo por escrito.

##### 4. Por dónde empezar

Orden sugerido a partir de las acciones de las fichas:

1. Reúna a las áreas de presupuesto, planeamiento y juventud, junto con los dos colectivos, para acordar el alcance de un piloto y una ficha sencilla de propuesta con problema, solución, costo estimado y población beneficiaria [Ficha 1, GOP + Jovem].
2. Convoque a jóvenes quechuahablantes de comunidades y a los colectivos para codiseñar el formato, las edades y la forma de participar, y consulte con ellos cómo se evaluará su pertinencia [Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo].
3. Organice las reuniones preparatorias y abra una matriz de propuestas, respuesta municipal y seguimiento que acompañe el proceso de marzo [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 5. Próximo paso

Esta semana, reúnase con el responsable de presupuesto de la municipalidad para acordar si puede reservarse una partida o un espacio de decisión juvenil en el presupuesto participativo 2027. Al salir debe tener una respuesta por escrito, sí o no, y en caso afirmativo el monto o el alcance.

##### 6. Referencias

**Ficha 1, GOP + Jovem en Vila Nova de Gaia.**
Instrumentos: presupuesto participativo juvenil, reglamento y normas de participación; plataforma municipal de propuestas y votación.
Fuentes de verificación:
[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.
[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.
[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.
[4] Municipalidad de Gaia. Reglamentos y normas de participación.
[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

**Ficha 3, Escuelas para el Buen Vivir en Ccarhuayo.**
Instrumentos: convenio municipal con la UGEL; enfoque de educación intercultural bilingüe; cuadernos de sabiduría elaborados con las familias.
Fuentes de verificación:
[1] Ministerio de Cultura (2016). Buenas Prácticas Interculturales en la Gestión Pública, experiencias 2014–2015, pp. 85–88.
[2] Ministerio de Cultura (11/12/2014). Entrega de premios de Buenas Prácticas Interculturales en Gestión Pública.

**Ficha 5, Participación de mujeres indígenas en Cotacachi.**
Instrumentos: presupuesto participativo, talleres y comités de seguimiento.
Fuentes de verificación:
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A2 · Hoja de recomendaciones

Perfil: autoridades y funcionarios municipales. Regidor, Municipalidad Distrital de El Agustino, Lima. Fecha: 10 de noviembre de 2026.

##### 1. Su consulta

Usted es regidor de la Municipalidad Distrital de El Agustino y consulta sobre fortalecimiento democrático y participación ciudadana. Quiere reactivar las juntas vecinales y lograr que la municipalidad responda a sus pedidos. Trabaja con juntas vecinales y organizaciones afroperuanas del distrito. Sus prioridades son la seguridad y la limpieza de espacios públicos. No cuenta con presupuesto adicional. Dispone de un área de participación vecinal con dos personas. No agregó texto propio.

##### 2. Buenas prácticas que aplican

**Construyendo Ciudadanía, San Luis Potosí (México)** [Ficha 7, Construyendo Ciudadanía en San Luis Potosí]. Es la práctica más cercana a su caso. El Ayuntamiento organizó juntas ciudadanas por demarcaciones y las vinculó con diagnóstico, priorización y seguimiento de acciones municipales. Ganó la 19.ª Distinción Buena Práctica en Participación Ciudadana del OIDP, entregada el 21 de mayo de 2025. El OIDP confirmó la constitución de 284 juntas. La candidatura reporta más de 35 000 votantes en 2022 y 390 espacios públicos rehabilitados. Estas cifras las declara la propia postulación. No hay evaluación independiente en las fuentes, y tener juntas en todo el territorio no significa que toda la población participe.

**GANA Municipales, Nariño (Colombia)** [Ficha 2, GANA Municipales en Nariño]. La Gobernación llevó a su equipo al territorio y sometió los proyectos a votación ciudadana, con información previa y rendición de cuentas. Ganó la 13.ª Distinción del OIDP, edición 2019. La candidatura reporta casi 100 000 participantes, cifra declarada por la entidad. Se financió con recursos departamentales de regalías, que no se pueden trasladar a un distrito de Lima, y no se acredita que continúe después de 2019. Su aplicación aquí se limita al método: presentar opciones claras y devolver resultados.

**Participación de mujeres indígenas, Cotacachi (Ecuador)** [Ficha 5, Participación de mujeres indígenas en Cotacachi]. El municipio preparó la participación de las mujeres antes de la reunión general y registró qué se hizo con sus propuestas. Ganó la 1.ª Distinción del OIDP en 2006. Es una experiencia histórica, sin prueba de continuidad ni de impacto causal. Su caso se parece al suyo en que trata la inclusión de un grupo concreto dentro del proceso municipal. No fue diseñada para población afroperuana, así que aquí solo sirve como método.

##### 3. Recomendaciones aplicables

1. **Parta de las juntas que ya existen.** Pida al área de participación vecinal que liste las juntas vecinales vigentes y su situación, sin crear espacios nuevos. La ficha 7 pide mapear juntas e instancias existentes antes de crear más. [Ficha 7, Construyendo Ciudadanía en San Luis Potosí]

2. **Acuerde una sola prioridad por junta y un responsable municipal para cada una.** Con sus prioridades de seguridad y limpieza, pida a cada junta que escoja un problema concreto y asigne un área municipal que responda. La ficha 7 condiciona la adaptación a que haya personal encargado de tramitar las solicitudes. [Ficha 7, Construyendo Ciudadanía en San Luis Potosí]

3. **Lleve el diálogo al territorio.** Programe reuniones en los barrios con el área competente en vez de citar a las juntas al local municipal. La experiencia de Nariño muestra que acercar al equipo técnico reduce barreras de acceso. [Ficha 2, GANA Municipales en Nariño]

4. **Presente opciones viables antes de pedir prioridades.** Para cada problema elegido, prepare dos o tres alternativas dentro de la competencia municipal, con costos orientativos, en lenguaje sencillo. Al no tener presupuesto adicional, parta de lo que el municipio ya puede hacer, como la coordinación de limpieza y la articulación con serenazgo. [Ficha 2, GANA Municipales en Nariño]

5. **Incluya a las organizaciones afroperuanas con una reunión previa.** Antes de la reunión general, reúnase con ellas para identificar las barreras que enfrentan (horarios, convocatoria, quién habla) y recoger sus propuestas. Acuerde con ellas cómo participarán y cómo se les devolverá la respuesta. Evite diseñar esta participación sin consultarlas. [Ficha 5, Participación de mujeres indígenas en Cotacachi]

6. **Lleve un registro público de pedidos y respuestas.** Abra una matriz sencilla con el pedido, el área responsable, la fecha de respuesta y el estado (aceptado, pendiente o rechazado, con razón). La ficha 5 muestra que registrar qué ocurre con cada propuesta le da continuidad a la participación, y la ficha 7 recomienda medir el cumplimiento de acuerdos y no solo el número de juntas. [Ficha 5, Participación de mujeres indígenas en Cotacachi] [Ficha 7, Construyendo Ciudadanía en San Luis Potosí]

##### 4. Por dónde empezar

1. Reúna a las dos personas del área de participación vecinal para listar las juntas vecinales vigentes y las organizaciones afroperuanas del distrito, con datos de contacto y último contacto con la municipalidad.
2. Convoque al responsable de seguridad ciudadana y al de limpieza pública para acordar qué pedidos pueden atender sin presupuesto adicional y quién responde cada uno.
3. Elija una o dos juntas piloto con las que haya mejor relación y realice con ellas una primera reunión en el barrio.
4. Reúnase por separado con las organizaciones afroperuanas para acordar cómo participarán antes de convocar a una sesión conjunta.
5. Abra la matriz de pedidos y respuestas desde la primera reunión y compártala con las juntas.

##### 5. Próximo paso

Esta semana, pida al área de participación vecinal que prepare el listado de juntas vecinales y organizaciones afroperuanas vigentes. Resultado esperado: un listado único que le permita elegir las juntas piloto y convocar la primera reunión.

##### 6. Referencias

**Ficha 7. Construyendo Ciudadanía, San Luis Potosí.** Instrumentos: ley estatal de Juntas de Participación Ciudadana; planes municipales de desarrollo; juntas, consejo y matriz de indicadores.
[1] OIDP (2025). San Luis Potosí gana la 19.ª Distinción por Construyendo Ciudadanía.
[2] Ayuntamiento de San Luis Potosí (2025). Candidatura Construyendo Ciudadanía ante el OIDP.

**Ficha 2. GANA Municipales, Nariño.** Instrumentos: plan departamental de desarrollo, proyectos tipo, jornadas de votación y plataforma de decisión.
[1] Gobernación de Nariño (2019). Candidatura GANA Municipales ante el OIDP.
[2] OIDP (2019). Nariño gana la 13.ª Distinción a la Buena Práctica en Participación Ciudadana.

**Ficha 5. Participación de mujeres indígenas, Cotacachi.** Instrumentos: presupuesto participativo, talleres y comités de seguimiento.
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso A3 · Hoja de recomendaciones

Perfil: Autoridades y funcionarios municipales, Municipalidad Distrital de El Carmen, departamento de Ica. Fecha: 10 de noviembre de 2026.

##### 1. Su consulta

Usted es Gerente de Desarrollo Social de la Municipalidad Distrital de El Carmen. Quiere mejorar la atención a mujeres afroperuanas que denuncian violencia. Su tema es la lucha contra la discriminación, y sus prioridades son la DEMUNA y el CEM. La municipalidad cuenta con personal reducido. Usted pide un centro como el de Goiás y pregunta cuánto cuesta y cuántas mujeres atendió.

##### 2. Buenas prácticas que aplican

**Centro Especializado de Atendimento à Mulher (CEAM) Brasilete Ramos Caiado, ciudad de Goiás, Brasil** [Ficha 8, Atención integral a mujeres en Goiás]. El gobierno municipal ofrece orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, y acciones de prevención (charlas, cursos y talleres). Funciona desde 2013. Recibió el Premio Construir Igualdad 2020, categoría Áreas Urbanas de hasta un millón de habitantes, del CIPDH-UNESCO, entregado el 7 de enero de 2021.

Sobre sus dos preguntas, las fuentes de la ficha no permiten responderlas:
- **Costo:** las fuentes no desagregan presupuesto ni dotación de personal. No hay una cifra de costo que citar.
- **Mujeres atendidas:** las fuentes no publican una cifra comparable de usuarias atendidas ni una reducción atribuible de la violencia. Esos impactos no se afirman. El reconocimiento de UNESCO y CIPDH acredita la calidad de la experiencia, no su alcance en número de casos.

La documentación consultada es de 2019 a 2021 y no acredita que el centro siga funcionando hoy.

La ficha tampoco acredita un programa específico para comunidades quilombolas. El enfoque para mujeres afroperuanas es una propuesta de adaptación para Perú, no algo que Goiás haya ejecutado.

**Participación de mujeres indígenas en Cotacachi, Ecuador** [Ficha 5, Participación de mujeres indígenas en Cotacachi]. No trata violencia. Aporta un método para que las propias mujeres preparen sus propuestas en espacios propios y las lleven a decisiones del municipio. Fue premiada por el OIDP en 2006. Es una referencia de método, no un servicio de atención.

##### 3. Recomendaciones aplicables

1. **Parta de lo que ya tiene.** Goiás ofrece atención integral desde un servicio municipal especializado. En El Carmen, la Gerencia de Desarrollo Social puede mapear qué hacen hoy la DEMUNA y el CEM, y qué hacen los demás servicios competentes (MIMP, salud, justicia), con las responsabilidades de cada uno. El objetivo es cerrar barreras de acceso y continuidad, no duplicar servicios [Ficha 8, Atención integral a mujeres en Goiás].

2. **Mejore la articulación antes de pensar en un centro nuevo.** Con personal reducido, la propuesta de adaptación de la ficha es reforzar la coordinación municipal con los servicios especializados existentes, no abrir un servicio aparte. Una mujer que denuncia debe poder pasar de la DEMUNA al CEM y a los servicios de salud y justicia sin repetir su relato [Ficha 8, Atención integral a mujeres en Goiás].

3. **Verifique si las derivaciones se completan.** Según la ficha, la coordinación debe traducirse en derivaciones efectivas y trato respetuoso, y eso requiere seguimiento. Asigne a una persona del equipo la tarea de confirmar cuántas derivaciones llegan a destino y por qué otras no [Ficha 8, Atención integral a mujeres en Goiás].

4. **Codiseñe las medidas con organizaciones de mujeres afroperuanas.** La ficha propone trabajar con organizaciones de mujeres afroperuanas y andinas medidas de trato sin discriminación y acceso lingüístico. Esta condición se mantiene: las medidas no se definen sin ellas [Ficha 8, Atención integral a mujeres en Goiás].

5. **Cuide la confidencialidad y el consentimiento.** La ficha lo pide como condición de adaptación. Defina con el personal de la DEMUNA y el CEM cómo se comparte la información de cada caso y con qué autorización de la mujer [Ficha 8, Atención integral a mujeres en Goiás].

6. **Use espacios previos de preparación para escuchar a las mujeres.** En Cotacachi, reuniones propias de mujeres antes de la instancia general mejoraron las condiciones para formular propuestas. Si se hace algo similar en El Carmen, acuerde con las participantes horario, cuidado de hijos y desplazamiento, y conéctelo con decisiones municipales concretas [Ficha 5, Participación de mujeres indígenas en Cotacachi].

##### 4. Por dónde empezar

1. Reúna a la DEMUNA, al CEM y a los servicios de salud y justicia del distrito. Identifique una barrera de acceso concreta, por ejemplo qué paso de la ruta de atención hoy se pierde, y acuerden una mejora de orientación o derivación con un responsable de seguimiento [Ficha 8, Atención integral a mujeres en Goiás].
2. Invite a organizaciones de mujeres afroperuanas del distrito a esa reunión o a una previa. Pregúnteles qué barreras viven al denunciar y qué trato esperan.
3. Abra una matriz sencilla con las propuestas de las mujeres, la respuesta de la municipalidad y el seguimiento [Ficha 5, Participación de mujeres indígenas en Cotacachi].
4. Si desea saber cuánto costó y cuántas mujeres atendió el CEAM, solicite esos datos directamente a su gestión en Goiás. Las fuentes de esta Caja de Herramientas no los contienen.

##### 5. Próximo paso

Esta semana, convoque a la DEMUNA y al CEM a una reunión de una hora. El resultado esperado es una barrera de acceso identificada, una mejora acordada y una persona responsable de darle seguimiento.

##### 6. Referencias

**Ficha 8.** Instrumentos: servicio municipal especializado y actividades de prevención mediante charlas, cursos y talleres.
- [1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.
- [2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.
- [3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.
- [4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 5.** Instrumentos: presupuesto participativo, talleres y comités de seguimiento.
- [1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
- [2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S1 · Hoja de recomendaciones

Perfil: Sociedad civil. Colectivo de jóvenes afroperuanas (independiente), Lima. 10 de noviembre de 2026.

##### 1. Su consulta

Usted coordina un colectivo independiente de 15 jóvenes afroperuanas de Lima Metropolitana, sin presupuesto, con contacto con una red afroperuana y con el CEM. Varias integrantes fueron a la municipalidad o a la comisaría por violencia y recibieron mal trato o fueron enviadas de una oficina a otra. Quieren que la municipalidad atienda sin discriminación y derive bien los casos. Llevarán una propuesta a la Gerencia de Desarrollo Social y a la mesa de concertación del distrito. Los ejes de su consulta son Lucha contra la discriminación y Enfoque de género.

##### 2. Buenas prácticas que aplican

**Centro Especializado de Atendimento à Mulher (CEAM) Brasilete Ramos Caiado, Goiás, Brasil** [Ficha 8, Atención integral a mujeres en Goiás]. Es un servicio de la municipalidad de Goiás que ofrece orientación, acogida y acompañamiento interdisciplinario a mujeres en situación de violencia, y acciones de prevención (charlas, cursos y talleres). Empezó en 2013 y ganó el Premio Construir Igualdad 2020 (CIPDH-UNESCO), entregado el 7 de enero de 2021. Las fuentes no publican cuántas usuarias atendió ni una reducción de la violencia atribuible al centro. Tampoco acreditan un programa específico para comunidades quilombolas ni que siga operando en 2026. El enfoque étnico para Lima es una propuesta de adaptación, no una experiencia ya realizada.

**Escuela de Liderazgo de Mujeres para Ciudades Seguras, Izabal, Guatemala** [Ficha 6, Liderazgo de mujeres para ciudades seguras]. Es una formación de lideresas en derechos, ciudades seguras e incidencia, de Fundación Guatemala, con población indígena y garífuna. Obtuvo el Tercer Premio a las Buenas Prácticas Locales con Enfoque de Género (UIM, 2013) y formó a 130 mujeres comunitarias. Su evaluación advierte que no hubo línea de base, así que su impacto no está medido. Es formación, no garantiza cargos ni representación. Aplica a su caso solo de forma parcial: sirve para plantear luego una formación de lideresas jóvenes, no como primer paso.

**Procesos de inclusión de mujeres indígenas en Cotacachi, Ecuador** [Ficha 5, Participación de mujeres indígenas en Cotacachi]. Se usó en un presupuesto participativo, con reuniones propias de mujeres antes de la instancia general y devolución de sus prioridades al proceso cantonal. Ganó la Distinción OIDP 2006. Las fuentes no demuestran continuidad actual ni impactos causales. Es la ficha más lejana a su pedido, pero aporta una idea útil: preparar sus propuestas entre ustedes antes de entrar a la mesa.

##### 3. Recomendaciones aplicables

1. **Pida mejorar el acceso y la derivación antes que crear un servicio nuevo.** Lo que la Ficha 8 permite adaptar a Lima es la articulación municipal con los servicios especializados que ya existen, para cerrar barreras de acceso y continuidad sin duplicar servicios. Pida a la Gerencia de Desarrollo Social que acuerde con el CEM, salud y justicia una ruta de derivación con responsables claros [Ficha 8, Goiás].

2. **Documente los casos de trato discriminatorio y de derivación fallida.** La fuente de Goiás no tiene evaluación de obstáculos, y su propia ficha pide comprobar si las derivaciones se completan. Con el consentimiento de cada compañera, registre dónde fue, quién la atendió, a dónde la enviaron y qué barrera encontró (racismo, falta de información, dependencia económica). Resguarde la confidencialidad: el registro no debe identificar a nadie sin su acuerdo [Ficha 8, Goiás].

3. **Proponga medidas de trato sin discriminación codiseñadas con su red.** La adaptación para Lima plantea trabajar con organizaciones de mujeres afroperuanas medidas de trato sin discriminación y acceso lingüístico. Este enfoque étnico concreto es una propuesta para Perú, no una práctica ya ejecutada en Goiás. Presente su red afroperuana como parte del codiseño [Ficha 8, Goiás].

4. **Prepare su propuesta entre ustedes antes de la mesa de concertación.** Cotacachi muestra que preparar la participación antes de la reunión general mejora las condiciones para que las mujeres formulen propuestas propias. Acuerden entre las 15 integrantes y con la red las tres demandas prioritarias y quién habla en cada una [Ficha 5, Cotacachi].

5. **Pida un registro público de respuesta.** En Cotacachi se recomienda registrar las propuestas aceptadas, pendientes o rechazadas y sus razones. Pida que la municipalidad lleve una matriz sencilla de propuestas, respuesta y seguimiento, para que la mesa pueda revisar avances [Ficha 5, Cotacachi].

##### 4. Por dónde empezar

Para llevar a la Gerencia de Desarrollo Social y a la mesa de concertación, puede leer en la reunión:

> "Somos un colectivo de 15 jóvenes afroperuanas de Lima. Varias compañeras fueron a la municipalidad o a la comisaría por violencia y fueron mal tratadas o enviadas de oficina en oficina. Pedimos que la municipalidad acuerde con el CEM y los servicios competentes una ruta de derivación con responsables claros, y que revise con nuestra red medidas de trato sin discriminación. Ofrecemos aportar los casos documentados con consentimiento y participar en el diseño. Pedimos un registro público de qué se acepta, qué queda pendiente y por qué."

Qué pedir en concreto:
- Una reunión con la Gerencia de Desarrollo Social, el CEM y su red, para identificar una barrera de acceso y acordar una mejora de orientación o derivación.
- Un responsable municipal con nombre para dar seguimiento.
- Que la propuesta quede en el acta de la mesa de concertación con fecha de revisión.

Dado que no tienen presupuesto, no pida recursos para el colectivo en esta primera etapa. Pida tiempo de la gerencia y compromisos de coordinación, que es lo que las fichas permiten sustentar.

##### 5. Próximo paso

Esta semana, convoque a las 15 integrantes y a un contacto de la red afroperuana para acordar las tres demandas y repartir quién presentará cada una, con la lista lista antes de pedir la reunión con la Gerencia.

##### 6. Referencias

**Ficha 8, Atención integral a mujeres en Goiás.** Instrumentos: servicio municipal especializado y actividades de prevención mediante charlas, cursos y talleres. Fuentes de verificación:
[1] UNESCO (19/01/2021). Ciudad de México y Goiás, ganadoras del Premio Construir Igualdad 2020.
[2] CIPDH (s. f.). Premio Construir Igualdad 2020 y descripción del CEAM.
[3] Confederação Nacional de Municípios (2021). Centro Especializado de Atendimento à Mulher Brasilete Ramos Caiado, Goiás GO.
[4] Confederação Nacional de Municípios (2019). Visita al CEAM de Goiás; inicio en 2013 y acompañamiento interdisciplinario.

**Ficha 6, Liderazgo de mujeres para ciudades seguras.** Instrumentos: escuela de liderazgo, formación en derechos y herramientas para ciudades seguras. Fuentes de verificación:
[1] UIM (02/09/2013). Fallo de la II edición de los premios a las buenas prácticas locales con enfoque de género.
[2] Fundación Guatemala (s. f.). Programa Ciudades Seguras y Escuela de Liderazgo de Mujeres.
[3] Suárez Trueba y Bolaños Vargas (2013). Evaluación final del Programa Ciudades Seguras de ONU Mujeres Guatemala.

**Ficha 5, Participación de mujeres indígenas en Cotacachi.** Instrumentos: presupuesto participativo, talleres y comités de seguimiento. Fuentes de verificación:
[1] Municipio de Cotacachi y OIDP (2006). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF.
[2] Municipios Abiertos Ecuador (s. f.). Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S2 · Hoja de recomendaciones

Perfil: sociedad civil. Organización: independiente. Departamento: Cusco. Fecha: 10 de noviembre de 2026.

##### 1. Su consulta

Usted participa como persona independiente desde Cusco y consulta sobre participación juvenil. Se dirige a jóvenes universitarios y quiere lograr que exista un presupuesto para jóvenes. Su prioridad es llegar al alcalde. No señaló condiciones particulares y dijo que no sabe bien cómo empezar. Esta hoja le propone un punto de partida concreto, basado en una experiencia documentada.

##### 2. Buenas prácticas que aplican

**GOP + Jovem, Presupuesto Participativo Juvenil de Vila Nova de Gaia (Portugal)** [Ficha 1, GOP + Jovem en Vila Nova de Gaia]. La Câmara Municipal de Vila Nova de Gaia, a través de su División Municipal de Juventud, convoca propuestas de jóvenes de 13 a 30 años, las somete a votación y financia las ganadoras con una partida definida. La edición 2025 contó con 240 000 euros, con un máximo de 40 000 por proyecto. Ese monto corresponde a esa edición y no es un costo de réplica en Perú. El programa recibió el Innovation in Politics Awards 2025 en la categoría Democracia y está documentado por la OCDE.

Como resultado concreto, el Parque Multigeneracional de Serzedo, ganador de la edición 2020, se inauguró el 19 de febrero de 2025. La fuente acredita esa obra terminada, pero no es una evaluación del impacto de todo el programa. Tampoco explica por qué pasaron cinco años entre la selección y la inauguración.

Esta ficha encaja con su caso en lo central: un presupuesto reservado para propuestas de jóvenes. Se aleja en un punto. Es una experiencia de un municipio europeo con un área de juventud ya establecida, y usted parte como persona independiente, sin esa estructura detrás.

##### 3. Recomendaciones aplicables

1. **Averigüe qué mecanismo participativo existe en su municipalidad.** La ficha pide, como primera condición, identificar el mecanismo participativo existente, la competencia municipal y una partida viable. Para ello, consulte en la municipalidad de su provincia o distrito quién atiende a la juventud y qué espacios de participación funcionan hoy. [Ficha 1, Condiciones de adaptación]

2. **Proponga un piloto pequeño, no un presupuesto completo.** La experiencia de Gaia se apoya en una partida identificable y reglas públicas, que permiten explicar qué puede decidir la juventud. Pida una partida acotada y con reglas claras, para que el alcalde pueda decidir sobre algo concreto. [Ficha 1, Factores de éxito]

3. **Acuerde con jóvenes universitarios las edades y las reglas.** La ficha indica que las edades y las reglas se acuerdan antes de lanzar la convocatoria. Reúna a un grupo de estudiantes de su universidad para decidir quiénes pueden proponer y cómo se vota. [Ficha 1, Condiciones de adaptación]

4. **Prepare una ficha sencilla de propuesta.** Incluya el problema, la solución, el costo estimado y la población beneficiaria. Con ese formato, las ideas de los jóvenes llegan ordenadas a la autoridad. [Ficha 1, Acción sugerida]

5. **Ofrezca apoyo para formular propuestas y no deje que el acceso digital decida quién participa.** La ficha advierte que la participación no debe depender de quién tiene internet o experiencia en trámites. Si el piloto incluye a jóvenes de comunidades andinas, la ficha indica que la pertinencia étnica debe diseñarse con las propias juventudes. Para Huamanga propone combinar convocatoria urbana y comunitaria, con facilitación en quechua cuando corresponda y presentación presencial de ideas. Es una propuesta de adaptación de los autores de la Caja de Herramientas, no una experiencia ejecutada, y Cusco no está contemplado en ella. [Ficha 1, Elementos adaptables]

6. **Pida que se publiquen los avances.** La ficha recomienda publicar hitos de ejecución y comunicar las demoras, porque el caso de Serzedo muestra que pueden pasar años entre elegir un proyecto y entregarlo. [Ficha 1, Aprendizajes]

##### 4. Por dónde empezar

Para llevar a la autoridad, puede usar este texto en una reunión o en una carta dirigida al alcalde:

"Soy un ciudadano de Cusco y represento a un grupo de jóvenes universitarios interesados en participar en las decisiones de la municipalidad. Pedimos que se reserve una partida pequeña del presupuesto para proyectos propuestos y votados por jóvenes, con reglas públicas. En Vila Nova de Gaia, Portugal, un programa así financió un parque entregado en 2025 y fue premiado internacionalmente. Le pedimos una reunión con el área que atiende a la juventud para acordar el alcance de un piloto."

Qué pedir en concreto:
- Una reunión con el alcalde o con el área municipal que atiende a la juventud.
- Que se defina una partida viable y acotada para un piloto.
- Que las reglas (edades, formato de propuesta, forma de votación) se acuerden con jóvenes antes de abrir la convocatoria.
- Que se publiquen los avances de ejecución.

##### 5. Próximo paso

Esta semana, reúna a entre tres y cinco compañeros universitarios interesados y acuerden juntos qué problema de su universidad o barrio quisieran resolver con un proyecto financiado. Con ese ejemplo concreto, anote sus datos de contacto y solicite por escrito una reunión a la municipalidad. El resultado esperado es una fecha de reunión con alguien que pueda decidir.

##### 6. Referencias

**Ficha 1: GOP + Jovem, Presupuesto Participativo Juvenil de Vila Nova de Gaia.**
Instrumentos: presupuesto participativo juvenil, reglamento y normas de participación; plataforma municipal de propuestas y votación.
Fuentes de verificación:
[1] OCDE (2022). Youth at the Centre of Government Action, capítulo 3, recuadro 3.5.
[2] Municipalidad de Gaia. GOP + Jovem 2025, condiciones y documentación.
[3] Municipalidad de Gaia (19/02/2025). Parque Multigeracional de Serzedo.
[4] Municipalidad de Gaia. Reglamentos y normas de participación.
[5] The Innovation in Politics Institute (18/09/2025). Ganadores de los Innovation in Politics Awards 2025; ceremonia del 17/09/2025.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---

#### Caso S3 · Hoja de recomendaciones

Perfil: sociedad civil. Federación de comunidades campesinas, Puno. Secretaria de actas. 10 de noviembre de 2026.

##### 1. Su consulta

Su federación reúne 12 comunidades aimaras de la zona rural de Puno. Quiere que las mujeres de esas comunidades participen en el presupuesto participativo con propuestas propias. Los temas marcados son participación ciudadana e interculturalidad y pertinencia territorial. Sus prioridades son la municipalidad provincial y el comité de vigilancia. Usted describe tres barreras: las asambleas son en castellano, las mujeres casi no hablan en ellas y algunas no saben leer. A eso se suman las distancias entre comunidades.

##### 2. Buenas prácticas que aplican

**Participación de mujeres indígenas en Cotacachi, Ecuador [Ficha 5, Participación de mujeres indígenas en Cotacachi].** El municipio facilitó espacios propios de mujeres, uso de la lengua originaria, materiales visuales y cotidianos, y reuniones autónomas cuyas prioridades se devolvían al proceso cantonal. Las mujeres también participaron en el seguimiento del presupuesto. La distinción del OIDP (2006) y la publicación documentan el proceso y una oficina de atención a la mujer operativa desde 2005. No prueban impactos causales ni que hoy siga vigente. Es la ficha más cercana a su caso: barreras de género, lengua y alfabetización.

**Construyendo Ciudadanía, San Luis Potosí, México [Ficha 7, Construyendo Ciudadanía].** El ayuntamiento organizó juntas ciudadanas por demarcación y las vinculó con diagnóstico, priorización y seguimiento de acciones municipales. Las cifras (284 juntas, más de 35 000 votantes en 2022) son reportes de la postulación. La ficha advierte que tener juntas no significa que toda la población participe. No trata de lengua ni de mujeres rurales indígenas, por lo que solo sirve para el vínculo con las instancias territoriales.

**Escuela de Liderazgo de Mujeres para Ciudades Seguras, Izabal, Guatemala [Ficha 6, Liderazgo de mujeres para ciudades seguras].** Fundación Guatemala formó a lideresas en derechos e incidencia; la evaluación externa de 2013 registra 130 mujeres comunitarias formadas. Es formación para participar, sin prueba de que las participantes llegaran a cargos. Su caso lo comparte en parte: mujeres de comunidades indígenas que necesitan preparación para hablar ante la autoridad.

Ninguna ficha corresponde a comunidades aimaras ni a Puno. La Ficha 5 es la más cercana y su idioma de trabajo es una lengua originaria, pero no consta qué lengua. Las adaptaciones de las fichas para Lima y Huamanga son propuestas de los autores de la Caja de Herramientas, no experiencias ya ejecutadas, y no hay ninguna propuesta específica para Puno.

##### 3. Recomendaciones aplicables

1. **Prepare las propuestas de las mujeres antes de la asamblea.** En Cotacachi, las reuniones propias de mujeres permitieron formular propuestas antes de ir al espacio general [Ficha 5]. Su federación puede organizar en cada comunidad una reunión previa solo de mujeres, en aimara, donde se acuerden dos o tres necesidades y se escojan quiénes las presentarán. Debe acordarse con ellas el horario, el cuidado de niñas y niños y el lugar.

2. **Lleve las propuestas en formatos que no exijan leer.** Cotacachi usó materiales visuales y cotidianos [Ficha 5]. Dibujos, objetos o mapas de la comunidad pueden reemplazar el texto escrito. Usted, como secretaria de actas, puede registrar las propuestas por escrito para la presentación, con el nombre de quien las formuló.

3. **Pida a la municipalidad provincial que facilite el uso del aimara y condiciones para participar.** La Ficha 5 muestra que la lengua originaria y las condiciones de participación fueron parte del método. Pida que las asambleas del presupuesto participativo incluyan traducción o facilitación en aimara, y que el horario y el lugar permitan asistir desde las comunidades lejanas. Antes de pedirlo, revise cómo está regulado hoy el proceso participativo en su provincia.

4. **Registre qué pasa con cada propuesta.** Cotacachi y San Luis Potosí coinciden en un punto: sin respuesta, la participación no tiene efecto [Fichas 5 y 7]. Lleve un registro sencillo de propuestas presentadas, respuesta de la municipalidad (aceptada, pendiente o rechazada) y la razón. Ese registro le sirve también ante el comité de vigilancia.

5. **Use el comité de vigilancia para el seguimiento.** En Cotacachi, las mujeres participaron en el seguimiento del presupuesto [Ficha 5]. Pida una reunión con el comité de vigilancia para que conozca las propuestas de las mujeres y revise con ustedes su cumplimiento. Las fichas no describen el comité peruano; confirme con él sus funciones.

6. **Conecte las 12 comunidades con las instancias que ya existen.** San Luis Potosí partió de juntas territoriales y de respuestas a sus solicitudes [Ficha 7]. Antes de crear un espacio nuevo, vea qué instancias de su zona ya reciben propuestas y cómo se comunican con la municipalidad.

##### 4. Por dónde empezar

Para llevar a la municipalidad provincial y al comité de vigilancia, puede leer en una reunión esta propuesta:

"Somos una federación de 12 comunidades aimaras. Las mujeres de nuestras comunidades quieren presentar propuestas propias en el presupuesto participativo, pero las asambleas son en castellano y varias no saben leer. Pedimos que la municipalidad provincial facilite el uso del aimara en las asambleas y acuerde con nosotras horarios y lugares posibles para quienes vienen de lejos. Pedimos también que el comité de vigilancia reciba nuestras propuestas y nos informe qué pasó con cada una."

Lo que pide en concreto:
- Una reunión con el área municipal a cargo del presupuesto participativo y con el comité de vigilancia, antes de la siguiente convocatoria.
- Facilitación en aimara en las asambleas.
- Un registro público de propuestas, con respuesta y fecha.

##### 5. Próximo paso

Esta semana, converse con la directiva de la federación para acordar en qué comunidad se hará la primera reunión de mujeres en aimara. Salga con fecha, lugar y quién convoca, para llegar con las dos o tres propuestas de cada comunidad a la siguiente asamblea.

##### 6. Referencias

- Ficha 5, Participación de mujeres indígenas en Cotacachi. Instrumentos: presupuesto participativo, talleres y comités de seguimiento. Fuentes: Municipio de Cotacachi y OIDP (2006), Procesos y mecanismos de inclusión de las mujeres indígenas en la gestión local, páginas 1–9 del PDF; Municipios Abiertos Ecuador (s. f.).
- Ficha 7, Construyendo Ciudadanía. Instrumentos: Ley estatal de Juntas de Participación Ciudadana; planes municipales de desarrollo; juntas, consejo y matriz de indicadores. Fuentes: OIDP (2025); Ayuntamiento de San Luis Potosí (2025).
- Ficha 6, Liderazgo de mujeres para ciudades seguras. Instrumentos: escuela de liderazgo, formación en derechos y herramientas para ciudades seguras. Fuentes: UIM (02/09/2013); Fundación Guatemala (s. f.); Suárez Trueba y Bolaños Vargas (2013), Evaluación final del Programa Ciudades Seguras de ONU Mujeres Guatemala.

Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.

---
