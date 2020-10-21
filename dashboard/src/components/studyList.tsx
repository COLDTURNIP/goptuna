import React, { FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"

import { studySummariesState } from "../state"
import { updateStudySummaries } from "../action"
import { formatDate } from "../utils/date"

const useTableStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

const StudySummariesTable: FC<{
  studies: StudySummary[]
}> = ({ studies = [] }) => {
  const classes = useTableStyles()
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="trials table">
        <TableHead>
          <TableRow>
            <TableCell>Study ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Datetime start</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studies.map((s) => {
            return (
              <TableRow key={s.study_id}>
                <TableCell component="th" scope="row">
                  <Link to={`/studies/${s.study_id}`}>{s.study_name}</Link>
                </TableCell>
                <TableCell>{s.study_name}</TableCell>
                <TableCell>{formatDate(s.datetime_start)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(2),
    },
  })
)

export const StudyList: FC<{}> = () => {
  const [ready, setReady] = useState(false)
  const [studySummaries, setStudySummaries] = useRecoilState<StudySummary[]>(
    studySummariesState
  )
  const classes = useStyles()

  useEffect(() => {
    updateStudySummaries(setStudySummaries) // fetch immediately
    const intervalId = setInterval(function () {
      updateStudySummaries(setStudySummaries)
    }, 10 * 1000)
    return () => clearInterval(intervalId)
  }, [])
  useEffect(() => {
    // TODO(c-bata): Show "no studies" if fetch is done.
    if (!ready && studySummaries.length !== 0) {
      setReady(true)
    }
  }, [studySummaries])

  const content = ready ? (
    <StudySummariesTable studies={studySummaries} />
  ) : (
    <p>Now loading...</p>
  )

  return (
    <div>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6">TOP</Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Card className={classes.card}>{content}</Card>
      </Container>
    </div>
  )
}
