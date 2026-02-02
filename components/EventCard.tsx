import Link from "next/link";
import Image from "next/image";

interface  Props {
    title: string,
    image: string,
    slug: string,
    location: string,
    time: string,
    date: Date
}

const EventCard = ({title, image, slug, location, time, date} : Props) => {
    const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    return (
        <Link href={`/event/${slug}`} id={'event-card'}>
            <Image src={image} alt={title} width={410} height={300} className={'poster'} />
            <div className={'flex flex-grow gap-2'}>
                <Image src={'/icons/pin.svg'} alt={'location'} width={14} height={14}/>
                <p>{location}</p>
            </div>
            <p className={'title'}>{title}</p>

            <div className='datetime'>
                <div>
                    <Image src={'/icons/calendar.svg'} alt={'date'} width={14} height={14}/>
                    <p>{formattedDate}</p>
                </div>
                <div>
                    <Image src={'/icons/clock.svg'} alt={'time'} width={14} height={14}/>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}
export default EventCard
