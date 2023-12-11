import { Star } from 'lucide-react';

const Comments = () => {
  return (
    <div className="flex">
      <div style={{ width: '300px' }}>
        <h1 className="text-center mb-2">Edward</h1>
        <div className="flex justify-center">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="mx-1 my-2" fill="#FFD60A" size={20} />
          ))}
        </div>
        <div className='ml-3'>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Inventore natus odio deleniti praesentium obcaecati.
          </p>
        </div>
      </div>
      <div className="border-l border-gray-300 mt-8 h-36 mx-2 justify-center"></div>
      <div style={{ width: '300px' }}>
        <h1 className="text-center mb-2">Sophie</h1>
        <div className="flex justify-center">
          {[...Array(4)].map((_, index) => (
            <Star key={index} className="mx-1 my-2" fill="#FFD60A" size={20} />
          ))}
        </div>
        <div className='ml-3'>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Inventore natus odio deleniti.
          </p>
        </div>
      </div>
      <div className="border-l border-gray-300 mt-8 h-36 mx-2 justify-center"></div>
      <div style={{ width: '300px' }}>
        <h1 className="text-center mb-2">Anonymous</h1>
        <div className="flex justify-center">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="mx-1 my-2" fill="#FFD60A" size={20} />
          ))}
        </div>
        <div className='ml-3'>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Inventore natus odio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comments;
