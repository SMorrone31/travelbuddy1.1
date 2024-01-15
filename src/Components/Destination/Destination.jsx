import "./destination.css"
import imm from "../../Assets/T1.jpg"
import imm1 from "../../Assets/T2.jpg"
import imm2 from "../../Assets/L1.jpg"
import imm3 from "../../Assets/L2.jpg"
import imm4 from "../../Assets/P1.jpg"
import imm5 from "../../Assets/P2.jpg"
import imm6 from "../../Assets/NY1.jpg"
import imm7 from "../../Assets/NY2.jpg"
import imm8 from "../../Assets/TK1.jpg"
import imm9 from "../../Assets/TK2.jpg"
import imm10 from "../../Assets/SY1.jpg"
import imm11 from "../../Assets/SY2.jpg"
import imm12 from "../../Assets/R1.jpg"
import imm13 from "../../Assets/R2.jpg"
import imm14 from "../../Assets/IN1.jpg"
import imm15 from "../../Assets/IN2.jpg"
import imm16 from "../../Assets/PE1.jpg"
import imm17 from "../../Assets/PE2.jpg"
import imm18 from "../../Assets/DB1.jpg"
import imm19 from "../../Assets/DB2.jpg"

import React, { useEffect } from "react";
import Aos from 'aos'
import 'aos/dist/aos.css'
import DestinationData from "./DestinationData";

const Destination = () => {

    // Inizializzazione di Aos con una durata di animazione di 2000ms
    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, [])

    return (
        <section className="destination container section">

            <div className="secTitle">
                <h3 data-aos='fade-right' className="title">
                    Popular destinations
                </h3>
                <p data-aos='fade-right'>Tour give you the opportunity to see a lot, whitin a time frame.</p>
            </div>

            <DestinationData
                className="first-des"
                heading="Bangkok, Thailandia"
                text="Bangkok, the capital of Thailand, is a captivating destination that seamlessly blends tradition and modernity. Known for its rich cultural heritage, the city boasts awe-inspiring Buddhist temples like Wat Pho and Wat Arun, providing insights into Thailand's spirituality and history. The local cuisine is a delightful adventure for the taste buds, with street markets offering dishes like pad thai and spicy som tam. Bangkok's vibrant nightlife caters to various tastes, from lively Khao San Road to romantic riverside dining. Shopaholics will find paradise in the city's bustling markets and upscale malls. What truly sets Bangkok apart is the warmth and hospitality of its people, earning Thailand its nickname, 'The Land of Smiles.' In essence, Bangkok offers a mesmerizing experience where visitors can immerse themselves in culture, savor exquisite flavors, and enjoy a dynamic urban atmosphere."
                img1={imm}
                img2={imm1}
            />

            <DestinationData
                className="first-des-reverse"
                heading="London, United Kingdom"
                text="London, the capital of the United Kingdom, is a captivating metropolis that seamlessly blends history, culture, and modernity. Renowned for its iconic landmarks such as the Tower Bridge, Buckingham Palace, and the British Museum, London is a treasure trove of historical and cultural significance. The city's vibrant arts scene, featuring world-class theaters like the West End, draws visitors seeking top-notch performances and musicals. London's culinary landscape is equally diverse, offering everything from traditional British pub fare to international cuisines found in bustling markets like Borough Market. 
                    Moreover, the city's green spaces, including Hyde Park and Regent's Park, provide a tranquil escape from the urban hustle and bustle. London's multicultural fabric adds to its allure, creating a rich tapestry of traditions and lifestyles. In essence, London offers an eclectic blend of the past and present, making it a must-visit destination for those in search of a multifaceted urban adventure."
                img1={imm2}
                img2={imm3}
            />

            <DestinationData
                className="first-des"
                heading="Paris, France"
                text="Paris, known as the 'City of Light', is one of the most romantic and culturally rich destinations in the world. Its iconic Eiffel Tower, a symbol of elegance and engineering, captivates visitors with breathtaking panoramic views of the city. The Louvre, one of the largest museums in the world, houses celebrated artistic masterpieces like Leonardo da Vinci's 'Mona Lisa'. The Gothic cathedral of Notre-Dame offers spectacular vistas from its tower. Montmartre, a bohemian neighborhood, is home to the enchanting Basilica of the Sacred Heart and attracts artists and creatives. A cruise on the Seine allows for admiring the major landmarks from the river's perspective. Parisian cuisine is renowned, and delightful patisseries cater to the most discerning palates. Paris is also a luxury shopping paradise with upscale boutiques and charming cafes. Finally, the romantic atmosphere makes Paris an irresistible destination for couples and travelers seeking beauty, culture, and passion."
                img1={imm4}
                img2={imm5}
            />

            <DestinationData
                className="first-des-reverse"
                heading="New York, USA"
                text="
                New York City, known as 'The Big Apple', is an iconic metropolis famous for its majestic skyscrapers like the Empire State Building and the One World Trade Center. The Broadway district offers world-class theatrical productions. Central Park, a green oasis in the heart of the city, provides a respite from urban frenzy. But the city offers much more, with its cultural diversity, eclectic cuisine, world-renowned museums, and vibrant nightlife. Each neighborhood has its unique charm, from Greenwich Village to Times Square. New York City is a destination that captures the imagination with its exceptional energy, culture, and architecture, offering a unique perspective on the United States."
                img1={imm6}
                img2={imm7}
            />

            <DestinationData
                className="first-des"
                heading="Tokyo, Japan"
                text="A trip to Tokyo, Japan, is a unique experience that blends tradition and modernity. The city offers the chance to explore ancient temples like Senso-ji Temple and admire illuminated skyscrapers like the Tokyo Skytree. Tokyo is a cosmopolitan metropolis with a frenetic energy, neighborhoods like Shibuya and Shinjuku feature bright billboards and advanced technology. Japanese cuisine is a highlight with sushi, ramen, and tempura. The city is rich in culture with art museums, traditional theaters, and pop culture. Japanese gardens offer moments of tranquility. In summary, Tokyo is an extraordinary city that combines the past and the future, offering a unique experience to explore Japan's culture and energy."
                img1={imm8}
                img2={imm9}
            />

            <DestinationData
                className="first-des-reverse"
                heading="Sydney, Australia"
                text="Sydney, Australia, is a captivating city renowned for its iconic landmarks such as the Sydney Opera House and Sydney Harbour Bridge, alongside its stunning beaches and outdoor lifestyle. The Opera House's distinctive sail-like design and the towering Harbour Bridge are symbols of the city's charm. Sydney boasts breathtaking beaches, including Bondi and Manly, perfect for surfing and relaxation. Its pleasant climate encourages outdoor activities, with opportunities for hiking in nearby national parks like the Blue Mountains. The city's diverse culinary scene, cultural institutions, and vibrant nightlife add depth to the experience. Sydney is a cosmopolitan haven offering a blend of natural beauty, culture, and a dynamic outdoor way of life."
                img1={imm10}
                img2={imm11}
            />

            <DestinationData
                className="first-des"
                heading="Rome, Italy"
                text="The Eternal City offers an abundance of historical sites, including the Colosseum, the Roman Forum, and the Vatican. Rome, the capital of Italy, is an extraordinary city brimming with timeless history, culture, and beauty. Known as 'The Eternal City', Rome captivates visitors with its remarkable blend of antiquity and modernity. Highlights of a trip to Rome include the iconic Colosseum, a testament to the grandeur of the Roman Empire, the Roman Forum, an ancient political and economic center, and the Vatican, home to St. Peter's Basilica and Michelangelo's masterpiece, the Pietà. Rome also boasts vibrant streets, cozy cafes, delicious cuisine, and a lively atmosphere. A visit to Rome promises to be a captivating journey through history and culture."
                img1={imm12}
                img2={imm13}
            />

            <DestinationData
                className="first-des-reverse"
                heading="Intanbul, Türkiye"
                text="A trip to Istanbul, Turkey, is an extraordinary experience at the crossroads of Europe and Asia. The city's rich cultural history and iconic landmarks, such as the Blue Mosque and Hagia Sophia, make it a top global tourist destination. The Blue Mosque, or Sultan Ahmed Mosque, stands out with its elegant domes and six minarets, adorned with intricate blue ceramic tiles. Hagia Sophia, once a Christian basilica, then a mosque, and now a museum, showcases its historical significance with its majestic dome and ancient mosaics. Beyond these landmarks, exploring the narrow streets of Sultanahmet reveals hidden treasures, bustling markets, and small mosques. Istanbul's unique geographic location offers stunning views of the Bosphorus and Marmara Sea. It's a place where history meets the present, creating an unforgettable experience for travelers."
                img1={imm14}
                img2={imm15}
            />

            <DestinationData
                className="first-des"
                heading="Pechino, China"
                text="A journey to Beijing, China, is an immersion in the country's rich history and culture. The city boasts iconic landmarks, including the awe-inspiring Forbidden City, a historic imperial palace complex; the Temple of Heaven, a masterful blend of architecture and spirituality; and the world-renowned Great Wall, offering breathtaking vistas. Beijing's allure extends beyond these landmarks, featuring a vibrant culinary scene, bustling markets, and a captivating juxtaposition of tradition and modernity with its mix of ancient structures and contemporary skyscrapers.
                    Exploring Beijing means delving into China's profound cultural legacy, encountering unparalleled architectural marvels, and feeling the pulse of one of the world's most populous and dynamic cities. Whether savoring traditional cuisine or contemplating centuries of history, a trip to Beijing promises an unforgettable voyage through China's past and present, where ancient wonders coexist harmoniously with a bustling metropolis."
                img1={imm16}
                img2={imm17}
            />

            <DestinationData
                className="first-des-reverse"
                heading="Dubai, United Arab Emirates"
                text="Dubai, in the United Arab Emirates, offers a unique travel experience in a desert city renowned for its luxury skyscrapers, extravagant shopping malls, and stunning artificial islands. It's a cosmopolitan metropolis amidst desert dunes, known for its architectural icons like the world's tallest building, Burj Khalifa, and the seven-star Burj Al Arab hotel, defining its opulent skyline.
                    Artificial islands like Palm Jumeirah and The World showcase remarkable engineering, housing luxury resorts, private beaches, and opulent residences. The city offers a vibrant culinary scene, ranging from local cuisine to high-end international dining. Activities include desert safaris, visits to traditional souks, and relaxation on white sandy beaches. Dubai is a luxurious and modern destination where opulence meets cutting-edge technology, providing travelers with a one-of-a-kind experience amidst remarkable human achievements and exceptional comforts in the heart of the desert."
                img1={imm18}
                img2={imm19}
            />

        </section>
    )
}

export default Destination