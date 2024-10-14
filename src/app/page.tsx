'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
}

type StyleRanges = Record<TeachingStyle, StyleRange[]>

// Definición de rangos y descripciones para cada estilo
const styleRanges: StyleRanges = {
  abierto: [
    { min: 0, max: 20, description: "Poco enfoque en metodologías abiertas" },
    { min: 21, max: 40, description: "Algunas técnicas de enseñanza abierta" },
    { min: 41, max: 60, description: "Equilibrio entre estructura y apertura" },
    { min: 61, max: 80, description: "Fuerte énfasis en aprendizaje abierto" },
    { min: 81, max: 100, description: "Excelente promoción de pensamiento libre" }
  ],
  formal: [
    { min: 0, max: 20, description: "Muy poca formalidad en la enseñanza" },
    { min: 21, max: 40, description: "Algo de estructura formal" },
    { min: 41, max: 60, description: "Equilibrio entre formalidad y flexibilidad" },
    { min: 61, max: 80, description: "Alta adherencia a métodos formales" },
    { min: 81, max: 100, description: "Enseñanza altamente estructurada y formal" }
  ],
  estructurado: [
    { min: 0, max: 20, description: "Poca estructura en el método de enseñanza" },
    { min: 21, max: 40, description: "Algo de organización en el contenido" },
    { min: 41, max: 60, description: "Buena estructuración del material" },
    { min: 61, max: 80, description: "Contenido muy bien organizado" },
    { min: 81, max: 100, description: "Excelente estructuración y secuenciación" }
  ],
  funcional: [
    { min: 0, max: 20, description: "Poco enfoque en aplicaciones prácticas" },
    { min: 21, max: 40, description: "Algunas conexiones con el mundo real" },
    { min: 41, max: 60, description: "Buen equilibrio entre teoría y práctica" },
    { min: 61, max: 80, description: "Fuerte énfasis en aplicaciones funcionales" },
    { min: 81, max: 100, description: "Excelente orientación hacia lo práctico" }
  ]
}

// Preguntas de ejemplo con estilos de enseñanza asociados
const questions: Question[] = [
  { id: 1, text: "¿El profesor fomenta la participación activa en clase?", style: 'abierto' },
  { id: 2, text: "¿El profesor sigue estrictamente el plan de estudios?", style: 'formal' },
  { id: 3, text: "¿Las clases tienen una estructura clara y definida?", style: 'estructurado' },
  { id: 4, text: "¿El profesor relaciona el contenido con situaciones prácticas?", style: 'funcional' },
  { id: 5, text: "¿Se promueve el debate y la discusión en clase?", style: 'abierto' },
  { id: 6, text: "¿El profesor utiliza métodos de evaluación tradicionales?", style: 'formal' },
  { id: 7, text: "¿Las actividades de clase siguen una secuencia lógica?", style: 'estructurado' },
  { id: 8, text: "¿Se realizan proyectos basados en problemas reales?", style: 'funcional' },
  { id: 9, text: "¿El profesor acepta múltiples perspectivas sobre un tema?", style: 'abierto' },
  { id: 10, text: "¿Se enfatiza la memorización de conceptos?", style: 'formal' },
]

export default function TeacherEvaluation() {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const questionsPerPage = 10
  const totalPages = Math.ceil(questions.length / questionsPerPage)

  useEffect(() => {
    const savedAnswers = localStorage.getItem('teacherEvaluationAnswers')
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('teacherEvaluationAnswers', JSON.stringify(answers))
  }, [answers])

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Evaluación del Estilo de Enseñanza</h1>
      <Progress value={(currentPage + 1) / totalPages * 100} className="mb-4" />
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
          transition={{ duration: 0.5 }}
        >
          {currentQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={answers.find(a => a.questionId === question.id)?.answer}
              onAnswer={handleAnswer}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between mt-4">
        <Button onClick={prevPage} disabled={currentPage === 0}>Anterior</Button>
        <Button onClick={nextPage}>
          {currentPage === totalPages - 1 ? 'Ver Resultados' : 'Siguiente'}
        </Button>
      </div>
    </div>
  )
}

function QuestionCard({ question, selectedAnswer, onAnswer }: {
  question: Question
  selectedAnswer?: 'SÍ' | 'NO'
  onAnswer: (questionId: number, answer: 'SÍ' | 'NO') => void
}) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">{question.text}</h2>
        <div className="flex gap-4">
          <Button
            variant={selectedAnswer === 'SÍ' ? "default" : "outline"}
            onClick={() => onAnswer(question.id, 'SÍ')}
            className="flex-1"
          >
            SÍ
          </Button>
          <Button
            variant={selectedAnswer === 'NO' ? "default" : "outline"}
            onClick={() => onAnswer(question.id, 'NO')}
            className="flex-1"
          >
            NO
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultsPage({ answers, questions }: { answers: Answer[], questions: Question[] }) {
  const calculateStylePercentages = () => {
    const styleCounts: Record<TeachingStyle, number> = {
      abierto: 0,
      formal: 0,
      estructurado: 0,
      funcional: 0
    }
    const styleTotals: Record<TeachingStyle, number> = {
      abierto: 0,
      formal: 0,
      estructurado: 0,
      funcional: 0
    }

    questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id)
      styleTotals[question.style]++
      if (answer?.answer === 'SÍ') {
        styleCounts[question.style]++
      }
    })

    return Object.entries(styleCounts).reduce((acc, [style, count]) => {
      const percentage = (count / styleTotals[style as TeachingStyle]) * 100
      const range = styleRanges[style as TeachingStyle].find(r => percentage >= r.min && percentage <= r.max)
      acc[style as TeachingStyle] = {
        percentage,
        description: range ? range.description : "No hay descripción disponible"
      }
      return acc
    }, {} as Record<TeachingStyle, { percentage: number; description: string }>)
  }

  const stylePercentages = calculateStylePercentages()

  const chartData = Object.entries(stylePercentages).map(([style, data]) => ({
    style: style.charAt(0).toUpperCase() + style.slice(1),
    value: data.percentage
  }))

  const chartConfig = {
    value: {
      label: "Porcentaje",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const dominantStyle = Object.entries(stylePercentages).reduce((a, b) => a[1].percentage > b[1].percentage ? a : b)[0]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resultados de la Evaluación</h1>
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Estilos de Enseñanza</CardTitle>
          <CardDescription>
            Porcentaje de cada estilo de enseñanza basado en las respuestas
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <RadarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
              }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="style" />
              <PolarGrid />
              <Radar
                name="Porcentaje"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Estilo predominante: {dominantStyle} ({stylePercentages[dominantStyle as TeachingStyle].percentage.toFixed(1)}%)
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            Total de preguntas: {questions.length}
          </div>
        </CardFooter>
      </Card>
      <h2 className="text-xl font-semibold mt-6 mb-4">Análisis por Estilo de Enseñanza</h2>
      {Object.entries(stylePercentages).map(([style, data]) => (

        <Card key={style} className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{style.charAt(0).toUpperCase() + style.slice(1)}</h3>
            <p className="mb-2">Porcentaje: {data.percentage.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </CardContent>
        </Card>
      ))}
      <h2 className="text-xl font-semibold mt-6 mb-4">Respuestas Detalladas</h2>
      {/* {questions.map(question => {
        const answer = answers.find(a => a.questionId === question.id)
        return (
          <Card key={question.id} className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold">{question.text}</h3>
              <p>Respuesta: {answer ? answer.answer : 'No respondida'}</p>
              <p className="text-sm text-muted-foreground">Estilo: {question.style}</p>
            </CardContent>
          </Card>
        )
      })} */}
    </div>
  )
}