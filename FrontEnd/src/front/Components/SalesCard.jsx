export function SalesCard({Title, Subtitle, Img}) {
    return (
        <div className='Card'>
            <div className='Card-img-container'>
                <img src={Img}/>
            </div>
            <div className='Card-items'>
                <h2>{Title}</h2>
                <h3>{Subtitle}</h3>
            </div>
        </div>
    )
}