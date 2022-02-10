import logo from './static/logo.png';

const Home = () => {

    return(
        <div className="home">
            <img src={logo} alt="" className="logo" />
            <div className="welcome">
                <h1>Welcome back.</h1>
                <h2>Because you're accessing sensitive info,</h2>
                <h2>you'll need to verify your password.</h2>
            </div>
        </div>
    );
}

export default Home;