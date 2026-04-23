import { atom, useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";

const pictures = Array.from({ length: 35 }, (_, i) => `${i + 2}`);

export const pageAtom = atom(0);
export const fixedPoseAtom = atom(false);
export const voiceVolumeAtom = atom(1.0);
export const voiceSpeedAtom = atom(1.5);
export const isMutedAtom = atom(false);

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}
pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

const allDialogues = [
  null, // index 0 unused
  { speaker: "confident.png", name: "Hung Di Du", text: "CỐ TỔNG BÍ THƯ ĐỖ MƯỜI\nĐÃ ĐƯA VIỆT NAM THOÁT KHỎI SIÊU LẠM PHÁT 1986–1989 NHƯ THẾ NÀO?\nHành trình từ khủng hoảng đến hồi sinh", audio: "1.wav" }, // Trang 1
  { speaker: "smile.png", name: "Hung Di Du", text: "Xin chào tất cả các bạn, mình là Y Di Sử.\nHôm nay, chúng ta sẽ cùng tìm hiểu cố Tổng Bí thư Đỗ Mười đã góp phần đưa Việt Nam thoát khỏi siêu lạm phát từ năm 1986 đến 1989 như thế nào.\nChỉ sau một đêm, giá gạo tăng gấp đôi.\nTiền tiết kiệm tháng trước mua được xe máy, tháng sau chỉ đủ vài cân gạo.", audio: "2.wav" }, // Trang 2
  { speaker: "worry.png", name: "Hung Di Du", text: "Người dân Việt Nam trong những năm 1986 đến 1989 đã thực sự sống trong cơn ác mộng mang tên siêu lạm phát.\nĐồng tiền mất giá từng ngày.\nHàng hóa leo thang chóng mặt.\nNiềm tin vào nền kinh tế gần như sụp đổ.\nNhưng giữa thời điểm tăm tối ấy, đã có một người góp phần kéo nền kinh tế Việt Nam thoát khỏi vực thẳm.", audio: "3.wav" }, // Trang 3
  { speaker: "thinking.png", name: "Hung Di Du", text: "Sau năm 1975, đất nước bị tàn phá nặng nề sau chiến tranh.\nViệt Nam cần khôi phục kinh tế nhanh bằng mô hình kế hoạch hóa tập trung theo kiểu Liên Xô.\nĐó là lúc nước ta bước vào thời kỳ bao cấp.", audio: "4.wav" }, // Trang 4
  { speaker: "analyze.png", name: "Hung Di Du", text: "Trong thời kỳ này, Nhà nước quản lý toàn bộ sản xuất và phân phối.\nMục tiêu là bảo đảm bình ổn, công bằng xã hội và hạn chế chênh lệch giàu nghèo.\nNền kinh tế vận hành chủ yếu qua chỉ tiêu, tem phiếu và ngân sách nhà nước.", audio: "5.wav" }, // Trang 5
  { speaker: "worry.png", name: "Hung Di Du", text: "Tuy nhiên, cơ chế này dần bộc lộ nhiều bất cập.\nChính sách trả công đồng đều khiến năng suất giảm.", audio: "6.wav" }, // Trang 6
  { speaker: "extreme.png", name: "Hung Di Du", text: "Do Mỹ cấm vận và quan hệ với Trung Quốc chưa bình thường, Việt Nam phải vay nợ và nhận viện trợ.\nHệ quả là sản xuất trì trệ, hàng hóa khan hiếm, đời sống khó khăn.\nĐiều đó đặt ra yêu cầu cải cách kinh tế một cách cấp thiết.", audio: "7.wav" }, // Trang 7
  { speaker: "confident.png", name: "Hung Di Du", text: "Năm 1985, Hội nghị Trung ương 8 khóa V ban hành chủ trương tổng điều chỉnh giá, lương, tiền.\nMục tiêu là xóa bỏ bao cấp, chuyển sang kinh tế thị trường.\nNhà nước điều chỉnh giá hàng hóa sát với chi phí sản xuất, quy đổi theo mức 25 đồng cho 1 kg thóc.", audio: "8.wav" }, // Trang 8
  { speaker: "analyze.png", name: "Hung Di Du", text: "Một số vật tư thiết yếu như xăng, dầu, xi măng, sắt thép được điều chỉnh tăng giá rất mạnh, có loại cao gấp 10 lần trước.\nNgười lao động được trả lương bằng tiền, tăng khoảng 20%.\nChính phủ cũng đổi tiền theo tỷ lệ 1 đổi 10 để giảm lượng tiền lưu thông.", audio: "9.wav" }, // Trang 9
  { speaker: "worry.png", name: "Hung Di Du", text: "Nhưng cuộc cải cách ấy đã thất bại.\nGiá vật tư tăng khiến sản xuất đình trệ.\nHàng hóa khan hiếm.\nGiá cả leo thang nhanh hơn lương.\nNhà nước buộc phải in thêm tiền.\nNgân sách cạn kiệt.\nNền kinh tế rơi sâu hơn vào khủng hoảng.", audio: "10.wav" }, // Trang 10
  { speaker: "extreme.png", name: "Hung Di Du", text: "Đến cuối năm 1985, lượng tiền lưu hành tăng 150% so với năm trước.\nLạm phát lên 73%, rồi bùng nổ ở mức ba con số trong các năm 1986 đến 1988.", audio: "11.wav" }, // Trang 11
  { speaker: "worry.png", name: "Hung Di Du", text: "Năm 1986, Việt Nam lạm phát bình quân trên 60% mỗi tháng.\nTrong khi đó, lãi suất tiết kiệm chỉ 2 đến 3% mỗi tháng.\nNgười dân mất niềm tin vào tiền đồng.\nHọ chuyển sang mua hàng hóa, vàng và USD để giữ giá trị tài sản.", audio: "12.wav" }, // Trang 12
  { speaker: "angry.png", name: "Hung Di Du", text: "Biện pháp đóng băng giá cả của Nhà nước nhanh chóng thất bại.\nNgười dân giao dịch ngầm theo giá thị trường.\nThị trường tự do vượt ngoài kiểm soát.", audio: "13.wav" }, // Trang 13
  { speaker: "confident.png", name: "Hung Di Du", text: "Cuối năm 1986, tại Đại hội VI, Đảng và Nhà nước nhìn nhận rõ cuộc khủng hoảng.\nMột quyết định lịch sử được đưa ra: tiến hành công cuộc đổi mới toàn diện nền kinh tế.", audio: "14.wav" }, // Trang 14
  { speaker: "thinking.png", name: "Hung Di Du", text: "Khi ông Đỗ Mười nhậm chức năm 1988, lạm phát vẫn gần 10% mỗi tháng.\nDoanh nghiệp quốc doanh thua lỗ triền miên.\nSản xuất đình đốn.\nĐồng tiền mất giá đến mức ngân hàng hầu như không còn ai gửi tiền.", audio: "15.wav" }, // Trang 15
  { speaker: "proud.png", name: "Hung Di Du", text: "Nhưng thay vì tiếp tục in thêm tiền hay đóng băng giá như trước đó, ông Đỗ Mười chọn con đường khó nhất: cải cách tận gốc.", audio: "16.wav" }, // Trang 16
  { speaker: "analyze.png", name: "Hung Di Du", text: "Ông mời hơn 10 chuyên gia kinh tế hàng đầu cùng ngồi lại xây dựng đề án chống lạm phát phi mã.\nĐó là một bản kế hoạch có thể xem như cuộc đại phẫu nền kinh tế.", audio: "17.wav" }, // Trang 17
  { speaker: "confident.png", name: "Hung Di Du", text: "Vấn đề đầu tiên là mất cân đối cung – cầu hàng hóa.\nTháng 5 năm 1989, để khắc phục tình trạng này, ông Đỗ Mười chỉ đạo đẩy mạnh sản xuất trong nước.\nMục tiêu là tạo ra một quỹ hàng hóa vững chắc, làm nền cho các biện pháp chống lạm phát mạnh mẽ hơn.", audio: "18.wav" }, // Trang 18
  { speaker: "smile.png", name: "Hung Di Du", text: "Ông cũng yêu cầu Bộ Ngoại thương xóa bỏ các quy định nhập khẩu phi mậu dịch bất hợp lý.\nHàng hóa do cán bộ, chuyên gia, du học sinh, Việt kiều mang về được miễn thuế và thu mua.\nChính sách đó khuyến khích nhập hàng tối đa để ổn định thị trường.", audio: "19.wav" }, // Trang 19
  { speaker: "thinking.png", name: "Hung Di Du", text: "Trước năm 1989, Việt Nam duy trì chế độ đa tỷ giá.\nCơ chế này kìm hãm xuất khẩu và làm doanh nghiệp mất động lực phát triển.", audio: "20.wav" }, // Trang 20
  { speaker: "confident.png", name: "Hung Di Du", text: "Vào tháng 5 năm 1989, Việt Nam chấm dứt chế độ đa tỷ giá.\nTỷ giá chính thức được điều chỉnh theo tín hiệu thị trường.\nTỷ giá tự do được phép dao động trong giới hạn 5%.\nChính sách này thúc đẩy xuất khẩu, tăng nguồn cung ngoại tệ và giảm thâm hụt cán cân thương mại, thanh toán.", audio: "21.wav" }, // Trang 21
  { speaker: "analyze.png", name: "Hung Di Du", text: "Vấn đề tiếp theo là bội chi ngân sách.\nÔng Đỗ Mười chỉ đạo ngừng dùng ngân sách để trợ cấp xuất khẩu và bù lỗ nhập khẩu.\nÔng cũng khuyến khích kiều bào gửi kiều hối về nước để tăng nguồn ngoại tệ.", audio: "22.wav" }, // Trang 22
  { speaker: "proud.png", name: "Hung Di Du", text: "Cùng với đó, hệ thống ngân hàng được tổ chức lại.\nNgân hàng Nhà nước làm chức năng quản lý.\nCác ngân hàng chuyên doanh hoạt động bằng vốn huy động từ xã hội.\nMục tiêu là giảm gánh nặng cho ngân sách nhà nước.", audio: "23.wav" }, // Trang 23
  { speaker: "confident.png", name: "Hung Di Du", text: "Nhưng quyết định quan trọng nhất chính là chính sách lãi suất thực dương.\nTrước đó, gửi tiết kiệm chẳng khác nào ném tiền qua cửa sổ.\nLãi suất ngân hàng chỉ 2 đến 3% mỗi tháng, trong khi giá cả tăng tới 10%.", audio: "24.wav" }, // Trang 24
  { speaker: "supprise.png", name: "Hung Di Du", text: "Ông Đỗ Mười quyết định nâng lãi suất lên 9% mỗi tháng, thậm chí 12% cho kỳ hạn 3 tháng.\nMột mức tưởng chừng phi lý, nhưng đủ để người dân tin rằng giữ tiền trong ngân hàng còn có lời hơn cất vàng ở nhà.", audio: "25.wav" }, // Trang 25
  { speaker: "smile.png", name: "Hung Di Du", text: "Ông từng nói một câu nổi tiếng:\n‘Giá hàng và giá tiền như thuyền với nước.\nThuyền lên thì nước cũng phải lên, không thể để thuyền cao mà nước thấp.’\nÔng Đỗ Mười thận trọng cho thí điểm tại Hải Phòng trước khi áp dụng trên toàn quốc.", audio: "26.wav" }, // Trang 26
  { speaker: "proud.png", name: "Hung Di Du", text: "Kết quả là chỉ trong 3 năm, Việt Nam từ siêu lạm phát chuyển sang ổn định.", audio: "27.wav" }, // Trang 27
  { speaker: "smile.png", name: "Hung Di Du", text: "Hàng hóa dần đầy ắp trở lại.\nTem phiếu bị xóa bỏ.\nThị trường bắt đầu đổi khác.", audio: "28.wav" }, // Trang 28
  { speaker: "thinking.png", name: "Hung Di Du", text: "Năm 1989, Việt Nam từng tính phải nhập khẩu 200.000 tấn lương thực mới đủ ăn cho cả nước.\nNhưng kết quả là không phải nhập.\nKhông những vậy, Việt Nam còn dự trữ được khoảng 500.000 tấn.\nLượng ngoại tệ khi đó cũng đủ để nhập thêm 500.000 tấn nữa nếu cần thiết.", audio: "29.wav" }, // Trang 29
  { speaker: "proud.png", name: "Hung Di Du", text: "Việt Nam từ một nước nhập khẩu gạo đã trở thành nước xuất khẩu gạo.\nĐó là dấu mốc cho thấy nền kinh tế đang thật sự chuyển mình.", audio: "30.wav" }, // Trang 30
  { speaker: "smile.png", name: "Hung Di Du", text: "Chỉ trong vài tháng, ngân hàng huy động được 1.000 tỷ đồng, gấp ba lần kế hoạch ban đầu.\nLiên Hợp Quốc gọi đây là một thành công phi thường trong lịch sử chống lạm phát thế giới.", audio: "31.wav" }, // Trang 31
  { speaker: "worry.png", name: "Hung Di Du", text: "Tất nhiên, cải cách nào cũng có giá của nó.\nHơn một nửa doanh nghiệp quốc doanh phá sản.\nKhoảng 600.000 công nhân mất việc.\nHọ phải nhận trợ cấp để tự xoay sở kiếm sống.", audio: "32.wav" }, // Trang 32
  { speaker: "confident.png", name: "Hung Di Du", text: "Nhưng ông Đỗ Mười không vì thế mà lùi bước.\nÔng tiếp tục điều chỉnh mức độ chống lạm phát theo đề án ban đầu.\nĐồng thời, ông khuyến khích kinh tế tư nhân và hỗ trợ người lao động chuyển đổi nghề.", audio: "33.wav" }, // Trang 33
  { speaker: "analyze.png", name: "Hung Di Du", text: "Từ sau đó, hàng loạt văn bản nền tảng ra đời.", audio: "34.wav" }, // Trang 34
  { speaker: "thinking.png", name: "Hung Di Du", text: "Nhiều nhà nghiên cứu nhận định rằng, nếu không có tư duy đổi mới và bản lĩnh của ông Đỗ Mười, nền kinh tế Việt Nam khi đó có thể đã sụp đổ.", audio: "35.wav" }, // Trang 35
  { speaker: "proud.png", name: "Hung Di Du", text: "Trong lúc đất nước khủng hoảng, ông chọn con đường cải cách thực chất, dựa vào nội lực và ý chí dân tộc.\nThay vì giải pháp ngắn hạn, ông đã giúp Việt Nam thoát khỏi siêu lạm phát và đặt nền móng cho nền kinh tế thị trường định hướng xã hội chủ nghĩa.\nTừ đó mở ra kỷ nguyên đổi mới và phát triển bền vững cho đất nước.", audio: "36.wav" }, // Trang 36
  { speaker: "smile.png", name: "Hung Di Du", text: "Có những giai đoạn lịch sử mà một quyết định đúng không chỉ cứu một nền kinh tế, mà còn mở ra cả một thời đại mới.\nCảm ơn các bạn đã quan tâm và theo dõi!", audio: "37.wav" }, // Trang 37
];

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [fixedPose, setFixedPose] = useAtom(fixedPoseAtom);
  const [voiceVolume, setVoiceVolume] = useAtom(voiceVolumeAtom);
  const [voiceSpeed, setVoiceSpeed] = useAtom(voiceSpeedAtom);
  const [isMuted, setIsMuted] = useAtom(isMutedAtom);

  const [audioEnabled, setAudioEnabled] = useState(false);

  // Enable audio after user interaction
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);
    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  // Page flip sound
  useEffect(() => {
    if (!audioEnabled) return;
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, [page, audioEnabled]);

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const [subPage, setSubPage] = useState(0);

  useEffect(() => {
    setSubPage(0);
  }, [page]);
  let currentTrang;
  if (page === 0) {
    currentTrang = 1;
  } else if (page === pages.length) {
    currentTrang = 37;
  } else if (page === pages.length - 1) {
    currentTrang = 36; // Only 1 dialogue on the last inner spread
  } else {
    currentTrang = page * 2 + subPage;
  }

  const currentDialog = allDialogues[currentTrang] || { 
    speaker: "smile.png", 
    name: "Hung Di Du", 
    text: "...", 
    audio: null 
  };

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (!currentDialog || !currentDialog.text) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let currentIndex = 0;
    const text = currentDialog.text;
    const typingSpeed = 35 / voiceSpeed; // Adjust typing speed relative to voice speed

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      }
    }, typingSpeed);

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [currentTrang, currentDialog, voiceSpeed]);

  const handleDialogClick = () => {
    if (isTyping) {
      // Instantly finish typing
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setDisplayedText(currentDialog.text);
      setIsTyping(false);
    } else {
      if (page > 0 && page < pages.length - 1 && subPage === 0) {
        setSubPage(1); // Advance to the right page dialogue
      } else {
        if (page < pages.length) {
          setPage(page + 1); // Turn the page
        }
      }
    }
  };

  // Voice audio playback
  useEffect(() => {
    if (!audioEnabled || !currentDialog.audio) return;
    
    const audio = new Audio(`/audios/${currentDialog.audio}`);
    audio.volume = voiceVolume;
    audio.playbackRate = voiceSpeed;
    audio.muted = isMuted;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Handle auto-play prevention or missing file
        console.log(`Could not play audio: ${currentDialog.audio}`);
      });
    }

    audio.onended = () => {
      // Auto-advance subPage if we are on the left page of a spread (and not the last ones)
      if (page > 0 && page < pages.length - 1 && subPage === 0) {
        setSubPage(1);
      }
    };

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.onended = null;
    };
  }, [currentTrang, audioEnabled, voiceVolume, voiceSpeed, isMuted]);

  return (
    <>
      {/* Halo is now moved to 3D scene */}

      {/* Main UI overlay */}
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col overflow-x-hidden">
        <a className="pointer-events-auto mt-10 ml-10" href=""></a>

        {/* Dialogue UI */}
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center pointer-events-none px-4 md:px-8">
            <div className="relative w-full max-w-[95%] md:max-w-6xl">
                {/* Text Box */}
                <div 
                    className="relative z-10 w-full pointer-events-auto transition-all duration-500 cursor-pointer hover:brightness-110"
                    onClick={handleDialogClick}
                >
                    {/* Main Dialog Box Cinematic */}
                    <div className="relative bg-slate-900/60 backdrop-blur-lg text-white border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-[0_10px_50px_rgba(0,0,0,0.5)] min-h-[90px] md:min-h-[140px] flex flex-row items-center gap-4 md:gap-8 overflow-hidden">
                        
                        {/* Soft cinematic gradient inside the box */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0"></div>

                        {/* Avatar Inside Dialog Box */}
                        <div className="shrink-0 w-20 sm:w-24 md:w-32 lg:w-40 rounded-xl md:rounded-2xl overflow-hidden border border-white/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] bg-white relative z-10">
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] pointer-events-none z-10 rounded-xl md:rounded-2xl"></div>
                            <img 
                                src={`/speaker/${currentDialog.speaker}`} 
                                alt="Speaker" 
                                className="w-full h-full object-cover opacity-95"
                            />
                        </div>

                        <div className="flex-1 w-full relative pt-1 md:pt-0 z-10">
                            {/* Name Tag - cinematic minimalist style */}
                            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-3 md:px-5 py-0.5 md:py-1 rounded-lg font-semibold md:font-bold text-xs md:text-sm tracking-widest mb-2 uppercase shadow-sm relative z-20">
                                {currentDialog.name}
                            </div>

                            <div className="absolute -top-6 right-2 md:right-8 text-white/5 font-serif font-black text-8xl md:text-[140px] select-none pointer-events-none z-0 leading-none">"</div>
                            
                            <div className="min-h-[60px] md:min-h-[80px]">
                                <p className="text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed text-gray-50 font-light relative z-10 w-full whitespace-pre-line pr-6 md:pr-10" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                                    {displayedText}
                                </p>
                            </div>
                        </div>
                        
                        {/* Next Indicator */}
                        {!isTyping && (
                            <div className="absolute bottom-3 right-3 md:bottom-5 md:right-8 animate-bounce text-white/60 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </>
  );
};
