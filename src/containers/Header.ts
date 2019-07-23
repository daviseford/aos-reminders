import { connect } from 'react-redux'
import Header from 'components/page/header'
import { todos } from 'ducks'

export default connect(
  null,
  { add: todos.actions.add }
)(Header)
