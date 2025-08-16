Bu projede ürünler FakeStoreAPI üzerinden çekilmektedir.
API’deki bazı ürünlerin görsel linkleri (özellikle Amazon CDN’den gelenler) artık geçerli olmadığı için çalışmıyor.

Kullanıcı deneyimini korumak adına:

SafeImage adında yeniden kullanılabilir bir component geliştirdim.

Bu component önce API’den gelen görseli göstermeyi dener.

Eğer görsel yüklenmezse (bozuk link / 404 vb.), otomatik olarak kategoriye uygun bir placeholder gösterir.

Böylece arayüzde kırık görseller yerine her zaman düzenli ve profesyonel bir görünüm sağlanır.

Bu yaklaşım:

Bozuk datalara rağmen kullanıcıya temiz bir deneyim sunar,

Production ortamında yaşanabilecek benzer durumlara karşı ölçeklenebilir bir çözümdür.
