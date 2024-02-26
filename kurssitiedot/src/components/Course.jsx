import React from 'react'

const Course = ({ course }) => {
  const Header = (props) => {
    return <h2>{props.course}</h2>
  }

  const Content = (props) => {
    return (
      <div>
        <Part part={props.part} exercises={props.exercises} />
      </div>
    )
  }

  const Total = (props) => {
    return (
      <div>
        <b>
          total of{' '}
          {props.course.parts.reduce(
            (total, currentValue) => total + currentValue.exercises,
            0
          )}{' '}
          exercises
        </b>
      </div>
    )
  }

  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercises}
      </p>
    )
  }

  return (
    <div>
      <h1>Web development curriculum</h1>
      {course.map((content) => {
        return (
          <React.Fragment key={content.id}>
            <Header course={content.name} />
            {content.parts.map((it) => (
              <React.Fragment key={it.id}>
                <Content part={it.name} exercises={it.exercises} />
              </React.Fragment>
            ))}
            <Total course={content} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Course
