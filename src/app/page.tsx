"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from "lucide-react"
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
    { min: 14, max: 13, description: "Preferencia Alta", percentage: "20%" },
    { min: 14, max: 20, description: "Preferencia Muy Alta", percentage: "10%" }
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

function StyleImprovement({ style, score, description }: { 
  style: TeachingStyle, 
  score: number, 
  description: string 
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

  const improvement = improvements[style]
  const getStyleColor = () => {
    const colors = {
      funcional: 'orange',
      abierto: 'blue', 
      formal: 'green',
      estructurado: 'purple'
    }
    return colors[style]
  }

  const color = getStyleColor()

  return (
    <div className="space-y-6">
      <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
        <h3 className={`text-xl font-bold text-${color}-800 mb-3`}>
          {improvement.title}
        </h3>
        <p className={`text-${color}-700 leading-relaxed mb-4`}>
          {improvement.overview}
        </p>
        <div className={`text-sm text-${color}-600 flex items-center gap-2`}>
          <span className="font-medium">Tu puntuación:</span>
          <span className="font-bold">{score}/20</span>
          <span>•</span>
          <span>{description}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Metodologías Activas Recomendadas:
        </h4>
        
        {improvement.methodologies.map((methodology, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <h5 className="font-semibold text-blue-800 mb-2">
                {methodology.name}
              </h5>
              <p className="text-gray-700 text-sm leading-relaxed">
                {methodology.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={`bg-gradient-to-r from-${color}-100 to-${color}-50 border-${color}-200`}>
        <CardContent className="p-5">
          <h5 className={`font-bold text-${color}-800 mb-3`}>
            {improvement.example.title}
          </h5>
          <p className={`text-${color}-700 text-sm leading-relaxed italic`}>
            {improvement.example.content}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function QuestionCard({ question, questionNumber, selectedAnswer, onAnswer }: {
  question: Question
  questionNumber: number
  selectedAnswer?: 'SÍ' | 'NO'
  onAnswer: (questionId: number, answer: 'SÍ' | 'NO') => void
}) {
  return (
    <Card className={`mb-4 transition-all duration-200 ${selectedAnswer ? 'border-blue-300 shadow-md' : 'border-gray-200'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-4 text-gray-800 leading-relaxed">
              {question.text}
            </h2>
            <div className="flex gap-3">
              <Button
                variant={selectedAnswer === 'SÍ' ? "default" : "outline"}
                onClick={() => onAnswer(question.id, 'SÍ')}
                className={`flex-1 py-3 transition-all duration-200 ${
                  selectedAnswer === 'SÍ' 
                    ? 'bg-green-600 hover:bg-green-700 border-green-600' 
                    : 'hover:border-green-300 hover:text-green-600'
                }`}
              >
                SÍ
              </Button>
              <Button
                variant={selectedAnswer === 'NO' ? "default" : "outline"}
                onClick={() => onAnswer(question.id, 'NO')}
                className={`flex-1 py-3 transition-all duration-200 ${
                  selectedAnswer === 'NO' 
                    ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                    : 'hover:border-red-300 hover:text-red-600'
                }`}
              >
                NO
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultsPage({ answers, questions }: { answers: Answer[], questions: Question[] }) {
  const calculateStyleScores = () => {
    const styleCounts: Record<TeachingStyle, number> = {
      abierto: 0,                                              
      formal: 0,
      estructurado: 0,
      funcional: 0
    }

    questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id)
      if (answer?.answer === 'SÍ') {
        styleCounts[question.style]++
      }
    })

    return Object.entries(styleCounts).reduce((acc, [style, count]) => {
      const range = styleRanges[style as TeachingStyle].find(r => count >= r.min && count <= r.max)
      acc[style as TeachingStyle] = {
        score: count,
        description: range ? range.description : "No hay descripción disponible",
        percentage: range ? range.percentage : "N/A"
      }
      return acc
    }, {} as Record<TeachingStyle, { score: number; description: string; percentage: string }>)
  }

  const styleScores = calculateStyleScores()

  const chartData = Object.entries(styleScores).map(([style, data]) => ({
    style: style.charAt(0).toUpperCase() + style.slice(1),
    value: data.score
  }))

  // Determinar estilo(s) predominante(s)
  const getDominantStyles = () => {
    const sortedStyles = Object.entries(styleScores).sort((a, b) => b[1].score - a[1].score)
    const highestScore = sortedStyles[0][1].score
    const dominantStyles = sortedStyles.filter(([_, data]) => data.score === highestScore)
    
    if (dominantStyles.length === 1) {
      return {
        primary: dominantStyles[0][0],
        secondary: null,
        isCombined: false
      }
    } else if (dominantStyles.length === 2) {
      return {
        primary: dominantStyles[0][0],
        secondary: dominantStyles[1][0],
        isCombined: true
      }
    } else {
      // Si hay más de 2 estilos empatados, tomar los dos primeros
      return {
        primary: dominantStyles[0][0],
        secondary: dominantStyles[1][0],
        isCombined: true
      }
    }
  }

  const dominantStyleInfo = getDominantStyles()
  const dominantStyle = dominantStyleInfo.primary

  const getColorForStyle = (style: string, score: number) => {
    const colors = {
      abierto: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      formal: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
      estructurado: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      funcional: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' }
    }
    return colors[style as keyof typeof colors] || colors.abierto
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Resultados de la Evaluación</h1>
        <p className="text-gray-600">Análisis de tu estilo de enseñanza predominante</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Radar de Estilos de Enseñanza</CardTitle>
          <CardDescription>
            Distribución de puntuaciones según el nuevo baremo actualizado
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="style" 
                tick={{ fontSize: 12, fill: '#374151' }}
                className="font-medium"
              />
              <Radar 
                name="Puntuación" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-center">
          <div className="flex items-center gap-2 font-semibold text-lg text-gray-800">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {dominantStyleInfo.isCombined ? (
              <>
                Estilos Predominantes: {dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)} - {dominantStyleInfo.secondary!.charAt(0).toUpperCase() + dominantStyleInfo.secondary!.slice(1)}
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full ml-2">
                  COMBINADO
                </span>
              </>
            ) : (
              <>
                Estilo Predominante: {dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)}
              </>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {dominantStyleInfo.isCombined ? (
              <>
                Puntuación: {styleScores[dominantStyle as TeachingStyle].score} puntos cada uno |
                Perfil híbrido con características mixtas
              </>
            ) : (
              <>
                Puntuación: {styleScores[dominantStyle as TeachingStyle].score} | 
                {styleScores[dominantStyle as TeachingStyle].description}
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Análisis Detallado por Estilo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(styleScores).map(([style, data]) => {
          const colors = getColorForStyle(style, data.score)
          const isPrimary = style === dominantStyle
          const isSecondary = style === dominantStyleInfo.secondary
          const isDominant = isPrimary || isSecondary
          
          return (
            <Card key={style} className={`${colors.bg} ${colors.border} border-2 ${isDominant ? 'ring-2 ring-blue-300' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`${colors.text} text-xl flex items-center justify-between`}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                  {isPrimary && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      PREDOMINANTE
                    </span>
                  )}
                  {isSecondary && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      CO-PREDOMINANTE
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Puntuación:</span>
                    <span className={`${colors.text} font-bold text-lg`}>{data.score}/20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Nivel:</span>
                    <span className={`${colors.text} font-semibold`}>{data.description}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Distribución:</span>
                    <span className={`${colors.text} font-semibold`}>{data.percentage}</span>
                  </div>
                  <Progress 
                    value={(data.score / 20) * 100} 
                    className="h-2 mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Propuestas de Mejora según Estilo Predominante */}
      <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Propuestas para la Mejora de tu Estilo de Enseñanza
          </CardTitle>
          <CardDescription className="text-blue-600 text-base">
            {dominantStyleInfo.isCombined ? (
              <>Metodologías activas recomendadas para el estilo híbrido {dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)} - {dominantStyleInfo.secondary!.charAt(0).toUpperCase() + dominantStyleInfo.secondary!.slice(1)}</>
            ) : (
              <>Metodologías activas recomendadas para el estilo {dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <StyleImprovement 
            primaryStyle={dominantStyle as TeachingStyle} 
            secondaryStyle={dominantStyleInfo.secondary as TeachingStyle | null}
            isCombined={dominantStyleInfo.isCombined}
            primaryScore={styleScores[dominantStyle as TeachingStyle].score}
            secondaryScore={dominantStyleInfo.secondary ? styleScores[dominantStyleInfo.secondary as TeachingStyle].score : 0}
            primaryDescription={styleScores[dominantStyle as TeachingStyle].description}
            secondaryDescription={dominantStyleInfo.secondary ? styleScores[dominantStyleInfo.secondary as TeachingStyle].description : ""}
          />
        </CardContent>
      </Card>

      <Card className="mt-8 bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Nota sobre el Baremo</h3>
          <p className="text-sm text-gray-600">
            Los resultados se basan en el baremo actualizado creado a partir de las respuestas de la población 
            docente que imparte la materia de algoritmos. Las puntuaciones están distribuidas según percentiles 
            que reflejan la preferencia relativa de cada estilo de enseñanza en esta población específica.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="px-6 py-2"
        >
          ← Realizar Nueva Evaluación
        </Button>
      </div>
    </div>
  )
}
