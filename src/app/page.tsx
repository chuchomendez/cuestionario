"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, X, Check } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Question = {
  id: number
  text: string
  style: TeachingStyle
}

type Answer = {
  questionId: number
  answer: 'SÍ' | 'NO'
}

type TeachingStyle = 'abierto' | 'formal' | 'estructurado' | 'funcional'

type StyleRange = {
  min: number
  max: number
  description: string
  percentage: string
}

type StyleRanges = Record<TeachingStyle, StyleRange[]>

// Nuevo baremo actualizado según la imagen proporcionada
const styleRanges: StyleRanges = {
  abierto: [
    { min: 0, max: 7, description: "Preferencia Muy Baja", percentage: "10%" },
    { min: 8, max: 9, description: "Preferencia Baja", percentage: "20%" },
    { min: 10, max: 13, description: "Preferencia Moderada", percentage: "40%" },
    { min: 14, max: 15, description: "Preferencia Alta", percentage: "20%" },
    { min: 16, max: 20, description: "Preferencia Muy Alta", percentage: "10%" }
  ],
  formal: [
    { min: 0, max: 8, description: "Preferencia Muy Baja", percentage: "10%" },
    { min: 9, max: 10, description: "Preferencia Baja", percentage: "20%" },
    { min: 11, max: 14, description: "Preferencia Moderada", percentage: "40%" },
    { min: 15, max: 16, description: "Preferencia Alta", percentage: "20%" },
    { min: 17, max: 20, description: "Preferencia Muy Alta", percentage: "10%" }
  ],
  estructurado: [
    { min: 0, max: 8, description: "Preferencia Muy Baja", percentage: "10%" },
    { min: 9, max: 10, description: "Preferencia Baja", percentage: "20%" },
    { min: 11, max: 13, description: "Preferencia Moderada", percentage: "40%" },
    { min: 14, max: 15, description: "Preferencia Alta", percentage: "20%" },
    { min: 16, max: 20, description: "Preferencia Muy Alta", percentage: "10%" }
  ],
  funcional: [
    { min: 0, max: 11, description: "Preferencia Muy Baja", percentage: "10%" },
    { min: 12, max: 13, description: "Preferencia Baja", percentage: "20%" },
    { min: 14, max: 15, description: "Preferencia Moderada", percentage: "40%" },
    { min: 16, max: 17, description: "Preferencia Alta", percentage: "20%" },
    { min: 18, max: 20, description: "Preferencia Muy Alta", percentage: "10%" }
  ]
}

const questions: Question[] = [

  { id: 1, text: "La programación me limita a la hora de desarrollar la enseñanza.", style: "abierto" },
  { id: 2, text: "Durante el curso desarrollo pocos temas pero los abordo en profundidad", style: "formal" },
  { id: 3, text: "Cuando propongo ejercicios dejo tiempo suficiente para resolverlos", style: "formal" },
  { id: 4, text: "Las actividades de clase implican, en la mayoría de las veces, aprendizaje de técnicas para ser aplicadas.", style: "funcional" },
  { id: 5, text: "Siempre acompaño las explicaciones de ejemplos prácticos y útiles", style: "funcional" },
  { id: 6, text: "Las actividades que propongo a los estudiantes están siempre muy estructuradas y con propósitos claros y entendibles.", style: "estructurado" },
  { id: 7, text: "Las cuestiones espontáneas o de actualidad que surgen en la dinámica de la clase, las priorizo sobre lo que estoy haciendo.", style: "abierto" },
  { id: 8, text: "En las reuniones de trabajo con los colegas asumo una actitud de escucha.", style: "formal" },
  { id: 9, text: "Con frecuencia reconozco el mérito de los estudiantes cuando han realizado un buen trabajo.", style: "funcional" },
  { id: 10, text: "Con frecuencia la dinámica de la clase es en base a debates.", style: "estructurado" },
  { id: 11, text: "Cumpliendo la planificación cambio de temas aunque los aborde superficialmente", style: "abierto" },
  { id: 12, text: "Fomento continuamente que los estudiantes piensen bien lo que van a decir antes de expresarlo.", style: "formal" },
  { id: 13, text: "Con frecuencia llevo a clase expertos en diferentes temas ya que considero que de esta manera se aprende mejor.", style: "funcional" },
  { id: 14, text: "La mayoría de los ejercicios que planteo se caracterizan por relacionar, analizar o generalizar.", style: "estructurado" },
  { id: 15, text: "Frecuentemente trabajo y hago trabajar bajo presión.", style: "estructurado" },
  { id: 16, text: "En clase solamente se trabaja sobre lo planificado no atendiendo otras cuestiones que surjan.", style: "formal" },
  { id: 17, text: "Doy prioridad a lo práctico y lo útil por encima de los sentimientos y las emociones.", style: "funcional" },
  { id: 18, text: "Me agradan las clases con estudiantes espontáneos, dinámicos e inquietos.", style: "abierto" },
  { id: 19, text: "Durante la clase no puedo evitar reflejar mi estado de ánimo.", style: "abierto" },
  { id: 20, text: "Evito que los estudiantes den explicaciones ante el conjunto de la clase", style: "formal" },
  { id: 21, text: "Tengo dificultad para romper rutinas metodológicas", style: "estructurado" },
  { id: 22, text: "Entre los estudiantes y entre mis colegas tengo fama de decir lo que pienso sin consideraciones.", style: "funcional" },
  { id: 23, text: "En los exámenes predominan las cuestiones prácticas sobre las teóricas.", style: "funcional" },
  { id: 24, text: "Sin haber avisado, no pregunto sobre los temas tratados.", style: "formal" },
  { id: 25, text: "En clase fomento que las intervenciones de los estudiantes se razonen con coherencia.", style: "estructurado" },
  { id: 26, text: "Generalmente propongo a los estudiantes actividades que no sean repetitivas.", style: "abierto" },
  { id: 27, text: "Permito que los estudiantes se agrupen por niveles intelectuales y/o académicos semejantes.", style: "estructurado" },
  { id: 28, text: "En los exámenes valoro y califico la presentación y el orden", style: "formal" },
  { id: 29, text: "En clase la mayoría de las actividades suelen estar relacionadas con la realidad y ser prácticas.", style: "funcional" },
  { id: 30, text: "Prefiero trabajar con colegas que considero de un nivel intelectual igual o superior al mío.", style: "estructurado" },
  { id: 31, text: "Muy a menudo propongo a los estudiantes que se inventen problemas, preguntas y temas para tratar y/o resolver.", style: "abierto" },
  { id: 32, text: "Me disgusta mostrar una imagen de falta de conocimiento en la temática que estoy impartiendo.", style: "estructurado" },
  { id: 33, text: "No suelo proponer actividades y dinámicas que desarrollen la creatividad y originalidad.", style: "formal" },
  { id: 34, text: "Empleo más tiempo en las aplicaciones y/o prácticas que en las teorías o lecciones magistrales.", style: "funcional" },
  { id: 35, text: "Valoro los ejercicios y las actividades que llevan sus desarrollo teóricos.", style: "estructurado" },
  { id: 36, text: "Al iniciar el curso tengo planificado, casi al detalle, lo que voy a desarrollar.", style: "formal" },
  { id: 37, text: "A los estudiantes les oriento continuamente en la realización de las actividades para evitar que caigan en el error", style: "funcional" },
  { id: 38, text: "En las reuniones de Departamento/Facultad, Claustros, Equipos de Trabajo y otras, habitualmente hablo más que escucho, aporto ideas y soy bastante participativo.", style: "abierto" },
  { id: 39, text: "La mayoría de las veces, en las explicaciones, aporto varios puntos de vista sin importarme el tiempo empleado.", style: "formal" },
  { id: 40, text: "Valoro que las respuestas en los exámenes sean lógicas y coherentes.", style: "estructurado" },
  { id: 41, text: "Prefiero estudiantes reflexivos y con cierto método de trabajo.", style: "formal" },
  { id: 42, text: "Potencio la búsqueda de lo práctico para llegar a la solución.", style: "funcional" },
  { id: 43, text: "Si en clase alguna situación o actividad no sale bien, no me agobio y, sin reparos, la replanteo de otra forma.", style: "abierto" },
  { id: 44, text: "Prefiero y procuro que durante la clase no haya intervenciones espontáneas.", style: "estructurado" },
  { id: 45, text: "Con frecuencia planteo actividades que fomenten en los estudiantes la búsqueda de información para analizarla y establecer conclusiones.", style: "formal" },
  { id: 46, text: "Si la dinámica de la clase funciona bien, no me planteo otras consideraciones y/o subjetividades.", style: "funcional" },
  { id: 47, text: "Al principio del curso no comunico a los estudiantes la planificación de lo que tengo previsto desarrollar.", style: "abierto" },
  { id: 48, text: "Con frecuencia suelo pedir voluntarios/as entre los estudiantes para que expliquen actividades a los demás.", style: "abierto" },
  { id: 49, text: "Los ejercicios que planteo suelen ser complejos aunque bien estructurados en los pasos a seguir para su realización.", style: "estructurado" },
  { id: 50, text: "Siento cierta preferencia por los estudiantes prácticos y realistas sobre los teóricos e idealistas.", style: "funcional" },
  { id: 51, text: "En los primeros días de curso presento y, en algunos casos, acuerdo con los estudiantes la planificación a seguir.", style: "formal" },
  { id: 52, text: "Soy más abierto a relaciones profesionales que a relaciones afectivas.", style: "estructurado" },
  { id: 53, text: "Generalmente cuestiono casi todo lo que se expone o se dice.", style: "estructurado" },
  { id: 54, text: "Entre mis colegas y en clase ánimo y procuro que no caigamos en comportamientos o dinámicas rutinarias.", style: "abierto" },
  { id: 55, text: "Reflexiono sin tener en cuenta el tiempo y analizo los hechos desde muchos puntos de vista antes de tomar decisiones.", style: "formal" },
  { id: 56, text: "El trabajo metódico y detallista me produce desasosiego y me cansa", style: "abierto" },
  { id: 57, text: "Prefiero y aconsejo a los estudiantes que respondan a las preguntas de forma breve y concreta.", style: "funcional" },
  { id: 58, text: "Siempre procuro impartir los contenidos integrados en un marco de perspectiva más amplio.", style: "estructurado" },
  { id: 59, text: "No es frecuente que proponga a los estudiantes el trabajar en equipo", style: "formal" },
  { id: 60, text: "En clase, favorezco intencionadamente el aporte de ideas sin ninguna limitación formal.", style: "abierto" },
  { id: 61, text: "En la planificación, los procedimientos y experiencias prácticas tienen más peso que los contenidos teóricos.", style: "funcional" },
  { id: 62, text: "Las fechas de los exámenes las anuncio con suficiente antelación.", style: "formal" },
  { id: 63, text: "Me siento bien entre colegas y estudiantes que tienen ideas capaces de ponerse en práctica.", style: "funcional" },
  { id: 64, text: "Explico bastante y con detalle pues considero que así favorezco el aprendizaje.", style: "formal" },
  { id: 65, text: "Las explicaciones las hago lo más breves posibles y si puedo dentro de alguna situación real y actual.", style: "abierto" },
  { id: 66, text: "Los contenidos teóricos los imparto dentro de experiencias y trabajos prácticos.", style: "funcional" },
  { id: 67, text: "Ante cualquier hecho favorezco que se razonen las causas.", style: "formal" },
  { id: 68, text: "En los exámenes las preguntas suelen ser lo más abiertas posibles.", style: "abierto" },
  { id: 69, text: "En la planificación trato fundamentalmente de que todo esté organizado y cohesionado desde la lógica de la disciplina.", style: "estructurado" },
  { id: 70, text: "Con frecuencia modifico los métodos de enseñanza.", style: "abierto" },
  { id: 71, text: "Prefiero trabajar individualmente ya que me permite avanzar a mi ritmo y no sentir agobios ni estrés.", style: "formal" },
  { id: 72, text: "En las reuniones con mis colegas trato de analizar los planteamientos y problemas con objetividad.", style: "estructurado" },
  { id: 73, text: "Antes que entreguen cualquier actividad, aconsejo que se revise y se compruebe su solución y la valoro sobre el proceso.", style: "funcional" },
  { id: 74, text: "Mantengo cierta actitud favorable hacia los estudiantes que razonan y actúan en coherencia.", style: "estructurado" },
  { id: 75, text: "Dejo trabajar en equipo siempre que la tarea lo permita.", style: "abierto" },
  { id: 76, text: "En los exámenes, exijo que los estudiantes escriban/muestren las explicaciones sobre los pasos/procedimientos en la resolución de los problemas y/o ejercicios.", style: "estructurado" },
  { id: 77, text: "No me gusta que se divague, enseguida pido que se vaya a lo concreto.", style: "funcional" },
  { id: 78, text: "Suelo preguntar en clase, incluso sin haberlo anunciado.", style: "abierto" },
  { id: 79, text: "En ejercicios y trabajos de los estudiantes no valoro ni califico ni doy importancia a la presentación, el orden y los detalles.", style: "abierto" },
  { id: 80, text: "De una planificación me interesa como se va a llevar a la práctica y si es viable.", style: "funcional" }

]

function QuestionCard({ question, questionNumber, selectedAnswer, onAnswer }: {
  question: Question
  questionNumber: number
  selectedAnswer: 'SÍ' | 'NO' | undefined
  onAnswer: (questionId: number, answer: 'SÍ' | 'NO') => void
}) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Pregunta {questionNumber}:
        </CardTitle>
        <CardDescription className="text-gray-900 font-medium text-base leading-relaxed">
          {question.text}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-start gap-4 p-4 pt-0">
        <Button
          variant={selectedAnswer === 'SÍ' ? 'default' : 'outline'}
          onClick={() => onAnswer(question.id, 'SÍ')}
          className="w-24 flex items-center justify-center gap-2"
        >
          {selectedAnswer === 'SÍ' && <Check className="h-4 w-4" />} SÍ
        </Button>
        <Button
          variant={selectedAnswer === 'NO' ? 'destructive' : 'outline'}
          onClick={() => onAnswer(question.id, 'NO')}
          className="w-24 flex items-center justify-center gap-2"
        >
          {selectedAnswer === 'NO' && <X className="h-4 w-4" />} NO
        </Button>
      </CardContent>
    </Card>
  )
}

function ResultsPage({ answers, questions }: { answers: Answer[], questions: Question[] }) {
  const calculateScores = () => {
    const scores: Record<TeachingStyle, number> = {
      abierto: 0,
      formal: 0,
      estructurado: 0,
      funcional: 0
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && answer.answer === 'SÍ') {
        scores[question.style] += 1;
      }
    });

    return scores;
  };

  const scores = calculateScores();
  const sortedStyles = Object.keys(scores).sort((a, b) => scores[b as TeachingStyle] - scores[a as TeachingStyle]) as TeachingStyle[];
  const primaryStyle = sortedStyles[0];
  const secondaryStyle = sortedStyles[1];
  const primaryScore = scores[primaryStyle];
  const secondaryScore = scores[secondaryStyle];

  const isCombined = secondaryScore > 13;

  const getRangeDescription = (style: TeachingStyle, score: number) => {
    const range = styleRanges[style].find(r => score >= r.min && score <= r.max);
    return range ? range.description : 'Puntuación no definida';
  };

  const primaryDescription = getRangeDescription(primaryStyle, primaryScore);
  const secondaryDescription = getRangeDescription(secondaryStyle, secondaryScore);
  
  const chartData = Object.entries(scores).map(([style, score]) => ({
    style: style.charAt(0).toUpperCase() + style.slice(1),
    score: score
  }));
  
  const formattedSecondaryStyle = isCombined ? secondaryStyle : null;
  const formattedPrimaryScore = primaryScore;
  const formattedSecondaryScore = secondaryScore;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Resultados del Test</h1>
        <p className="text-gray-600">Descubre tu Estilo de Enseñanza</p>
      </div>

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Tu Estilo de Enseñanza
          </CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Tu perfil dominante es **{primaryStyle.toUpperCase()}** con una puntuación de **{primaryScore}**.
            {isCombined && (
              <>
                <br />
                Tu perfil secundario es **{secondaryStyle.toUpperCase()}** con una puntuación de **{secondaryScore}**.
                Esto indica un perfil híbrido.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="style" />
                <Radar name="Puntuación" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <StyleImprovement
        primaryStyle={primaryStyle}
        secondaryStyle={formattedSecondaryStyle}
        isCombined={isCombined}
        primaryScore={formattedPrimaryScore}
        secondaryScore={formattedSecondaryScore}
        primaryDescription={primaryDescription}
        secondaryDescription={secondaryDescription}
      />
    </div>
  )
}

function StyleImprovement({ 
  primaryStyle, 
  secondaryStyle, 
  isCombined, 
  primaryScore, 
  secondaryScore, 
  primaryDescription, 
  secondaryDescription 
}: { 
  primaryStyle: TeachingStyle, 
  secondaryStyle: TeachingStyle | null,
  isCombined: boolean,
  primaryScore: number, 
  secondaryScore: number,
  primaryDescription: string,
  secondaryDescription: string
}) {
  const improvements = {
    funcional: {
      title: "Estilo de Enseñanza Funcional",
      overview: "Su práctica docente se centra en actividades prácticas con una apertura al trabajo en equipo. Los docentes con este estilo priorizan la utilidad y viabilidad de los contenidos, sustituyendo las exposiciones teóricas por experiencias y trabajos prácticos.",
      methodologies: [
        {
          name: "Aprendizaje Basado en Problemas (ABP) o Proyectos (ABPj)",
          description: "Esta metodología es ideal, ya que su propósito es resolver un problema o completar un proyecto del mundo real, lo cual se alinea perfectamente con la preferencia del docente funcional por la practicidad y la aplicación de conocimientos. Se podrían plantear problemas de optimización de código, desarrollo de un algoritmo para una tarea específica, o la creación de un pequeño software."
        },
        {
          name: "Gamificación",
          description: "La gamificación puede ser una excelente herramienta para mantener a los estudiantes motivados. A través de desafíos y recompensas, se pueden reforzar conceptos complejos de algoritmos de manera lúdica. Esto fomenta la creatividad, la resolución de problemas y la competencia sana, aspectos valorados por este estilo de enseñanza."
        }
      ],
      example: {
        title: "Ejemplo de aplicación:",
        content: "En la materia de Algoritmos, un docente con estilo funcional podría proponer un proyecto de fin de semestre: \"Desarrollar un algoritmo de búsqueda y ordenamiento eficiente para una base de datos de 1,000,000 de registros\". En lugar de solo enseñar la teoría, el docente guiaría a los equipos de estudiantes para que apliquen y prueben diferentes algoritmos (Burbuja, Quicksort, Merge Sort, etc.) en situaciones reales, analizando su desempeño y seleccionando el más adecuado."
      }
    },
    abierto: {
      title: "Estilo de Enseñanza Abierto",
      overview: "Este docente es flexible, espontáneo, y le gusta trabajar con ideas originales. Su práctica se caracteriza por la motivación a los estudiantes con actividades novedosas, a menudo basadas en problemas reales, y el fomento del trabajo en equipo sin limitaciones formales.",
      methodologies: [
        {
          name: "Hackatones o Maratones de Programación",
          description: "Estas actividades promueven la colaboración, la creatividad y la resolución de problemas en un ambiente dinámico y de alta presión. El docente podría plantear desafíos de programación con un tiempo limitado, permitiendo a los estudiantes explorar soluciones innovadoras."
        },
        {
          name: "Design Thinking",
          description: "Esta metodología se basa en la ideación y prototipado rápido, lo cual coincide con la preferencia del docente abierto por la experimentación y el cambio de metodología. En la clase de Algoritmos, podría usarse para diseñar la lógica de un nuevo algoritmo antes de pasar a la codificación, permitiendo a los estudiantes debatir y actuar de forma espontánea."
        }
      ],
      example: {
        title: "Ejemplo de aplicación:",
        content: "Se podría organizar un mini-hackatón donde los estudiantes, en equipos, tengan 24 horas para crear un algoritmo que resuelva un problema de la vida real. Por ejemplo, optimizar una ruta de entrega. El docente actuaría como facilitador, alentando a los estudiantes a debatir y a proponer soluciones originales."
      }
    },
    formal: {
      title: "Estilo de Enseñanza Formal",
      overview: "Este docente se rige por una planificación estricta y detallada, no admitiendo la improvisación. Tiende a fomentar el trabajo individual y valora la reflexión, el análisis y la racionalidad.",
      methodologies: [
        {
          name: "Clase Invertida (Flipped Classroom)",
          description: "El docente puede mantener su rigurosa planificación al proporcionar el material teórico (videos, lecturas) para que los estudiantes lo revisen antes de clase. El tiempo en el aula, que típicamente se usaría para explicaciones magistrales, se dedicaría a la práctica y a la resolución de ejercicios complejos y detallados. Esto se alinea con la preferencia del docente formal por el trabajo individual y la profundidad en los contenidos."
        }
      ],
      example: {
        title: "Ejemplo de aplicación:",
        content: "Antes de la clase, el docente envía videos y lecturas sobre la notación asintótica (Big O). En clase, en lugar de explicar la teoría, guía a los estudiantes individualmente en el análisis de la complejidad de diferentes algoritmos. Esto les permite aplicar lo aprendido, profundizar en el contenido y sustentar sus ideas de manera racional."
      }
    },
    estructurado: {
      title: "Estilo de Enseñanza Estructurado",
      overview: "Este docente valora la coherencia y la lógica, impartiendo los contenidos dentro de un marco teórico amplio y sistemático. Se inclina por el trabajo con actividades complejas que requieran establecer relaciones y demostraciones.",
      methodologies: [
        {
          name: "Aprendizaje Basado en Casos (ABC)",
          description: "Esta metodología permite a los estudiantes analizar casos complejos relacionados con algoritmos, como la seguridad de una red o la eficiencia de un motor de búsqueda. Se fomenta el análisis, la demostración y la objetividad, lo cual se alinea con el enfoque del docente estructurado. Los estudiantes deben resolver los casos explicando cada paso y valorando el proceso sobre la solución."
        }
      ],
      example: {
        title: "Ejemplo de aplicación:",
        content: "El docente presenta un caso de estudio sobre la optimización de un sistema de recomendación en una plataforma de streaming. Los estudiantes deben analizar el caso, identificar los algoritmos utilizados, proponer mejoras y justificar sus decisiones con argumentos lógicos y coherentes. El docente puede guiar el proceso, asegurándose de que cada paso esté bien estructurado y documentado."
      }
    }
  }

  // Combinaciones de estilos para propuestas híbridas
  const combinedImprovements = {
    'abierto-estructurado': {
      title: "Estilo de Enseñanza Híbrido: Abierto-Estructurado",
      overview: "Su perfil combina la flexibilidad y espontaneidad del estilo abierto con la coherencia y lógica del estilo estructurado. Esto le permite ser creativo e innovador mientras mantiene un marco organizativo sólido para el aprendizaje.",
      methodologies: [
        {
          name: "Design Thinking Estructurado",
          description: "Combine la metodología de Design Thinking (del estilo abierto) con fases bien definidas y documentadas (del estilo estructurado). Los estudiantes pueden explorar soluciones creativas para algoritmos siguiendo un proceso sistemático de ideación, prototipado y validación."
        },
        {
          name: "Hackatones con Marco Teórico",
          description: "Organice hackatones donde los estudiantes trabajen libremente en equipos, pero requiera que fundamenten sus soluciones algorítmicas con análisis teórico riguroso. Esto combina la creatividad espontánea con el análisis sistemático."
        },
        {
          name: "Aprendizaje Basado en Casos Creativos",
          description: "Presente casos complejos que requieran análisis estructurado, pero permita múltiples enfoques creativos para la solución. Los estudiantes deben justificar lógicamente sus propuestas innovadoras."
        }
      ],
      example: {
        title: "Ejemplo de aplicación híbrida:",
        content: "Organice un 'Algoritmo Challenge' donde los equipos tengan libertad creativa para abordar un problema real (ej: optimización de tráfico urbano), pero deben seguir fases estructuradas: 1) Análisis teórico del problema, 2) Diseño creativo de la solución, 3) Implementación con justificación lógica, 4) Evaluación sistemática de resultados. Esto permite la espontaneidad del estilo abierto dentro del marco lógico del estilo estructurado."
      }
    },
    'abierto-formal': {
      title: "Estilo de Enseñanza Híbrido: Abierto-Formal",
      overview: "Su perfil combina la creatividad y flexibilidad del estilo abierto con la planificación detallada y reflexión profunda del estilo formal. Esto le permite ser innovador mientras mantiene rigor académico.",
      methodologies: [
        {
          name: "Clase Invertida con Debates Creativos",
          description: "Combine la planificación rigurosa del material teórico (formal) con sesiones de clase abiertas para debates espontáneos y exploración creativa de conceptos algorítmicos."
        },
        {
          name: "Proyectos Guiados con Exploración Libre",
          description: "Estructure proyectos con objetivos claros y planificación detallada, pero permita a los estudiantes explorar libremente diferentes enfoques y soluciones creativas."
        }
      ],
      example: {
        title: "Ejemplo de aplicación híbrida:",
        content: "Planifique detalladamente un curso sobre estructuras de datos, pero en cada módulo incluya 'sesiones de exploración libre' donde los estudiantes puedan proponer aplicaciones creativas e innovadoras de las estructuras estudiadas."
      }
    },
    'abierto-funcional': {
      title: "Estilo de Enseñanza Híbrido: Abierto-Funcional",
      overview: "Su perfil combina la creatividad y espontaneidad del estilo abierto con el enfoque práctico y aplicado del estilo funcional. Esto resulta en un enfoque muy dinámico y orientado a resultados prácticos.",
      methodologies: [
        {
          name: "Hackatones Orientados a Soluciones Reales",
          description: "Organice eventos creativos y espontáneos enfocados en resolver problemas prácticos del mundo real usando algoritmos. Combine la libertad creativa con la utilidad práctica."
        },
        {
          name: "Gamificación con Proyectos Aplicados",
          description: "Use elementos de juego y competencia sana, pero siempre orientados hacia la creación de soluciones algorítmicas que tengan aplicación práctica inmediata."
        }
      ],
      example: {
        title: "Ejemplo de aplicación híbrida:",
        content: "Realice 'Innovation Sprints' donde los equipos tienen libertad total para crear algoritmos innovadores que resuelvan problemas específicos de empresas locales, combinando creatividad sin límites con aplicabilidad práctica."
      }
    },
    'formal-estructurado': {
      title: "Estilo de Enseñanza Híbrido: Formal-Estructurado",
      overview: "Su perfil combina la planificación rigurosa y reflexión profunda del estilo formal con la lógica sistemática del estilo estructurado. Esto resulta en un enfoque muy académico y fundamentado.",
      methodologies: [
        {
          name: "Análisis de Casos con Fundamentación Teórica Profunda",
          description: "Combine el análisis sistemático de casos complejos con sesiones de reflexión profunda sobre los fundamentos teóricos, permitiendo a los estudiantes desarrollar comprensión tanto práctica como conceptual."
        },
        {
          name: "Clase Invertida con Marco Lógico",
          description: "Use la metodología de clase invertida pero con un enfoque muy estructurado, donde cada elemento teórico se conecta lógicamente con el siguiente en un marco coherente."
        }
      ],
      example: {
        title: "Ejemplo de aplicación híbrida:",
        content: "Desarrolle un curso donde los estudiantes estudien en profundidad la teoría de complejidad algorítmica (formal) y luego analicen sistemáticamente casos reales de optimización, conectando cada concepto teórico con aplicaciones lógicamente estructuradas."
      }
    },
    'formal-funcional': {
      title: "Estilo de Enseñanza Híbrido: Formal-Funcional",
      overview: "Su perfil combina la reflexión profunda y planificación detallada del estilo formal con el enfoque práctico del estilo funcional. Esto resulta en un balance entre rigor académico y aplicabilidad.",
      methodologies: [
        {
          name: "Clase Invertida con Proyectos Aplicados",
          description: "Combine la preparación teórica rigurosa fuera del aula con tiempo de clase dedicado a proyectos prácticos que apliquen directamente los conceptos estudiados."
        },
        {
          name: "Análisis Reflexivo de Implementaciones Prácticas",
          description: "Alterne entre sesiones de reflexión profunda sobre algoritmos y sesiones prácticas de implementación, asegurando que cada aplicación esté bien fundamentada teóricamente."
        }
      ],
      example: {
        title: "Ejemplo de aplicación híbrida:",
        content: "Los estudiantes estudian en profundidad la teoría de grafos, luego implementan algoritmos de grafos para resolver problemas reales como optimización de redes sociales, siempre reflexionando sobre la conexión teoría-práctica."
      }
    },
    'estructurado-funcional': {
      title: "Estilo de Enseñanza Híbrido: Estructurado-Funcional",
      overview: "Su perfil combina el análisis lógico y sistemático del estilo estructurado con el enfoque práctico y aplicado del estilo funcional. Esto resulta en un enfoque muy efectivo para la resolución de problemas.",
      methodologies: [
        {
          name: "Aprendizaje Basado en Problemas Estructurado",
          description: "Use problemas reales y prácticos, pero abórdelos de manera sistemática y lógica, asegurando que cada paso del proceso de solución esté bien fundamentado y documentado."
        },
        {
          name: "Gamificación con Análisis Sistemático",
          description: "Implemente elementos de juego para mantener la motivación práctica, pero requiera que los estudiantes analicen sistemáticamente sus estrategias y resultados."
        }
      ],
      example: {
        title: "Ejemplo de aplicación híbrida:",
        content: "Organice un 'Algoritmo Sprint' donde los equipos resuelven problemas prácticos, pero deben presentar una documentación detallada y lógica de su solución en cada fase del proceso."
      }
    }
  }

  const primaryInfo = improvements[primaryStyle];
  
  if (!primaryInfo) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Análisis de Estilo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No se encontraron datos de mejora para el estilo dominante. Por favor, revisa la configuración.</p>
        </CardContent>
      </Card>
    );
  }

  const isHighScore = primaryScore >= 14 || secondaryScore >= 14;

  const getCombinedInfo = () => {
    if (!secondaryStyle) return null;
    const key = `${primaryStyle}-${secondaryStyle}` as keyof typeof combinedImprovements;
    return combinedImprovements[key] || combinedImprovements[`${secondaryStyle}-${primaryStyle}` as keyof typeof combinedImprovements] || null;
  };

  const combinedInfo = getCombinedInfo();

  return (
    <Card className="mt-8 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          Mejora tu Estilo de Enseñanza
        </CardTitle>
        <CardDescription>
          Aquí tienes una guía personalizada para potenciar tus habilidades.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isCombined && combinedInfo ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {combinedInfo.title}
            </h2>
            <p className="text-gray-700">{combinedInfo.overview}</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Metodologías Híbridas Sugeridas:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {combinedInfo.methodologies.map((method, index) => (
                <Card key={index} className="p-4 bg-gray-50 border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg text-blue-700">{method.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </Card>
              ))}
            </div>

            {combinedInfo.example && (
              <Card className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
                <h4 className="font-bold text-lg text-blue-700">{combinedInfo.example.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{combinedInfo.example.content}</p>
              </Card>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {primaryInfo.title}
            </h2>
            <p className="text-gray-700">{primaryInfo.overview}</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Metodologías Sugeridas:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {primaryInfo.methodologies.map((method, index) => (
                <Card key={index} className="p-4 bg-gray-50 border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg text-blue-700">{method.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </Card>
              ))}
            </div>

            {primaryInfo.example && (
              <Card className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
                <h4 className="font-bold text-lg text-blue-700">{primaryInfo.example.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{primaryInfo.example.content}</p>
              </Card>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
export default function TeacherEvaluation() {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const questionsPerPage = 10
  const totalPages = Math.ceil(questions.length / questionsPerPage)

  const handleAnswer = (questionId: number, answer: 'SÍ' | 'NO') => {
    setAnswers(prev => {
      const newAnswers = prev.filter(a => a.questionId !== questionId)
      return [...newAnswers, { questionId, answer }]
    })
    setError(null)
  }

  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  )

  const nextPage = () => {
    const unansweredQuestions = currentQuestions.filter(
      question => !answers.some(answer => answer.questionId === question.id)
    )

    if (unansweredQuestions.length > 0) {
      setError(`Por favor, responde todas las preguntas antes de continuar.`)
      return
    }

    setError(null)

    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      if (answers.length === questions.length) {
        setShowResults(true)
      } else {
        setError('Por favor, responde todas las preguntas antes de ver los resultados.')
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
      setError(null)
    }
  }

  if (showResults) {
    return <ResultsPage answers={answers} questions={questions} />
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Evaluación del Estilo de Enseñanza</h1>
        <p className="text-gray-600">Responde con sinceridad a cada pregunta</p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span>Página {currentPage + 1} de {totalPages}</span>
        </div>
        <Progress value={(currentPage + 1) / totalPages * 100} className="h-2" />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={currentPage * questionsPerPage + index + 1}
              selectedAnswer={answers.find(a => a.questionId === question.id)?.answer}
              onAnswer={handleAnswer}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button 
          onClick={prevPage} 
          disabled={currentPage === 0}
          variant="outline"
          className="px-6"
        >
          ← Anterior
        </Button>
        <Button 
          onClick={nextPage}
          className="px-6"
        >
          {currentPage === totalPages - 1 ? 'Ver Resultados →' : 'Siguiente →'}
        </Button>
      </div>
    </div>
  )
}
