// this component gets rendered by App after the form is submitted
export default function Notification({mesage}) {
    return (
      <aside>
        <h4 >{mesage}</h4>
      </aside>
    )
  }